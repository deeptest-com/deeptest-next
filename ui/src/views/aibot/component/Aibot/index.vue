<template>
  <div class="aibot-main">
    <div class="fix-action-open dp-link clear-both"
         v-if="!showChat"
         @click="showOrNot"
         :title="'开始聊天'">
      <span class="open" />
    </div>

    <div v-if="showChat"
         class="aibot-container">
      <div class="header">
        <div class="logo">
          <img src="@/assets/images/chat-robot.png" />
        </div>

        <div class="label">知识库</div>
        <div class="contrl">
          <div class="select-wrapper">
            <select v-model="kb" class="select">
              <option v-for="option in aiKbs" :key="option.kb_name" :value="option.kb_name">
                {{ option.kb_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="action dp-link"
             @click="showOrNot">
          <span class="close" />
        </div>
      </div>

      <div class="messages" id="chat-messages">
        <template v-for="(item, index) in messages" :key="index" class="log">
          <div v-if="item.type === 'human'" class="chat-sender human">
            <div class="avatar-container">
              <div class="avatar"></div>
            </div>

            <div class="content">
              <span>{{item.content}}</span>

              <span>{{item.doc}}</span>

              <span v-if="index === messages.length - 1"
                    class="loading">
                <img src="@/assets/images/chat-loading.gif" />
              </span>
            </div>
          </div>

          <div v-if="item.type === 'robot'" class="chat-sender robot">
            <div class="avatar-container">
              <div class="avatar"></div>
            </div>

            <div class="content markdown-container">
              <Markdown :source="item.content" :linkify="true" :html="true" />
            </div>
            <div class="toolbar">
              <div class="call dp-link-primary"
                   @click="recall(index)">
                重新生成
              </div>

              <div class="copy dp-link"
                   @click="copy">
                <img src="@/assets/images/chat-copy.png" />
                复制
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="sender">
        <input id="msgInput" class="input" autocomplete="off"
               v-model="msg"
               @keydown="keyDown"
               @keyup.enter="send" />

        <span v-if="!isLoading" class="button dp-link"
              @click="send" />
        <span v-if="isLoading" class="button" />
      </div>

      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from "vue";
import {fetchEventSource} from '@microsoft/fetch-event-source';
import MarkdownItStrikethroughAlt from 'markdown-it-strikethrough-alt';
import Markdown from 'vue3-markdown-it';
import {notifySuccess} from "@/utils/notify";
import {getCache, setCache} from "@/utils/localCache";
import {
  scroll,
  setSelectionRange,
  list_knowledge_bases,
  getDocLink,
  getDocDesc,
  replaceLinkWithoutTitle,
  isUnderRobotMsg
} from "./service";
import consts from "@/config/constant";
import {addSepIfNeeded} from "@/utils/http/url";

const props = defineProps({
  llm: {
    type: String,
    default: '', // will use the first llm in chatchat server if empty
    required: false,
  },
  defaultKb: {
    type: String,
    default: 'wiki',
    required: true,
  },
  serverUrl: {
    type: String,
    default: 'http://127.0.0.1:9085/api/v1',
    required: true,
  },
});

const wikiAddress = 'https://wiki.nancalcloud.com'
const wakeUpWord = '小乐'
const humanName = 'Albert'
const humanAvatar = '../../../../assets/images/chat-einstein.png'

const CHAT_HISTORIES = 'chat_history_key'
const histories = ref([] as any[])
const historyIndex = ref(-1)

const aiKbs = ref([] as any[])
const kb = ref(props.defaultKb)
const msg = ref('')
const isLoading = ref(false)

const messages = ref([] as any[])
messages.value.push({
  type: 'human',
  name: humanName,
  content: wakeUpWord,
  avatar: humanAvatar,
})
messages.value.push({
  type: 'robot',
  name: 'ChatGPT',
  content: '您好，有什么可以帮助您的？',
})
scroll()

const isChatting = ref(false)
const send = async () => {
  console.log('send ...')
  msg.value = msg.value.trim()
  if (!msg.value) return

  const index = histories.value.indexOf(msg.value)
  if (index > -1) {
    histories.value.splice(index, 1);
  }

  if (histories.value.length >= 30) histories.value = histories.value.splice(0,1)

  const userMsg = msg.value
  if (''+userMsg !== wakeUpWord) {
    histories.value.push(''+userMsg)
    historyIndex.value = histories.value.length
    setCache(CHAT_HISTORIES, histories.value)
    msg.value = ''
  }

  isChatting.value = true

  const humanMsg = {
    type: 'human',
    name: humanName,
    content: userMsg,
    avatar: humanAvatar,
  }
  messages.value.push(humanMsg)
  scroll()

  const serverUrl = addSepIfNeeded(props.serverUrl)
  const url = `${serverUrl}aichat/knowledge_base_chat`
  console.log('chat', url)

  const ctrl = new AbortController();

  const data = {
    "messages": [
      {"role": "user", "content": "请使用markdown格式返回结果"}
    ],
    "model": props.llm,
    "tool_choice": "search_local_knowledgebase",
    "tool_input": {"database": "wiki", "query": userMsg},
    "stream": true
  }

  isLoading.value = true

  await fetchEventSource(url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: ctrl.signal,

    async onopen(response) {
      console.log('onopen', response)

      if (response.ok) { // && response.headers.get('content-type') === EventStreamContentType) {
        return
      } else {
        console.log('onopen error, response is ', response)
      }
    },

    onmessage(msg: any) {
      console.log('onmessage', msg)

      // return if no data
      if (!msg.data)
        return

      let jsn = {} as any
      try {
        jsn = JSON.parse(msg.data)
      } catch(err) {
        console.log('parse chatchat msg failed', msg.data)
        return
      }

      // return if being __BREAK__ msg
      if (jsn.choices && jsn.choices.length > 0 && jsn.choices[0].delta?.content === '__BREAK__')
        return

      const doc_contents = [] as any[]
      let msg_content = ''

      // docs
      if (jsn.tool_output?.docs && jsn.tool_output?.docs.length > 0) {
        jsn.tool_output?.docs.forEach((doc) => {
          if (doc.page_content) {
            let doc_content = getDocDesc(doc.page_content.trim())

            const {pageId, pageType} = getDocLink(doc.metadata.source)
            if (pageType === 'html') { // is link
              doc_content =
                `[${doc_content}](${wikiAddress}/pages/viewpage.action?pageId=${pageId})`
            }

            doc_contents.push(doc_content)
          }
        })
      }

      // msgs
      if (jsn.choices && jsn.choices.length > 0) {
        jsn.choices?.forEach((choice) => {
          if (choice.delta?.content && choice.delta?.content !== '__BREAK__') {
            msg_content += choice.delta?.content?.trim()
          }
        })
      }

      const robotMsg = {
        type: 'robot',
        name: humanName,
        content: msg_content + '  \n\n' + (doc_contents.length > 0 ? '  \n出处：\n1. ' + doc_contents.join('  \n1. ') : ''),
        avatar: humanAvatar,
      }
      robotMsg.content = replaceLinkWithoutTitle(robotMsg.content)
      console.log('!!!!!!', robotMsg)
      messages.value.push(robotMsg )

      scroll()
      isLoading.value = false
    },

    onclose() {
      console.log('onclose')
      isChatting.value = false
    },
    onerror(err) {
      console.log('onerror', err)
      isChatting.value = false
    }
  });
}

const keyDown = (event) => {
  console.log(event)

  if (historyIndex.value === -1 && histories.value.length === 0) { // fist time
    return
  }

  if (event.keyCode === consts.keyCodeUp) {
    console.log('up')

    if (historyIndex.value === -1) { // fist time
      historyIndex.value = histories.value.length - 1
      msg.value = histories.value[historyIndex.value]

      setSelectionRange(document.getElementById('msgInput'), msg.value.length)

      return
    }

    if (historyIndex.value > 0) {
      historyIndex.value--
    }
    msg.value = histories.value[historyIndex.value]

  } else if (event.keyCode === consts.keyCodeDown) {
    console.log('keyDown', event)

    if (historyIndex.value === -1 ||  // fist time
        historyIndex.value === histories.value.length - 1) { // is max
      historyIndex.value === -1
      msg.value = ''
      return
    }

    historyIndex.value++
    msg.value = histories.value[historyIndex.value]
  }

  if (event.keyCode === consts.keyCodeUp || event.keyCode === consts.keyCodeDown) {
    setSelectionRange(document.getElementById('msgInput'), msg.value.length)
  }
}

const initAiData = async () => {
  const serverUrl = addSepIfNeeded(props.serverUrl)

  const kbsResp = await list_knowledge_bases(serverUrl)
  console.log('list_knowledge_bases', kbsResp)
  if (kbsResp.code === 0)
    aiKbs.value = kbsResp.data
}

const initHistory = async () => {
  histories.value = await getCache(CHAT_HISTORIES)
  if (!histories.value) histories.value = []
  // if (histories.value.length > 0)
  //   msg.value = histories.value[histories.value.length - 1]
}

const showChat = ref(true)
const showOrNot = () => {
  showChat.value = !showChat.value
}

const recall = (index) => {
  console.log('recall', index)
  if (index > messages.value.length - 1) {
    return
  }

  const item = messages.value[index-1]
  msg.value = item.content
  send()
}

const copy = () => {
  console.log('copy')
  if (messages.value.length === 0 || !navigator.clipboard) {
    return
  }

  navigator.clipboard.writeText(messages.value[messages.value.length - 1].content)
  notifySuccess('成功复制回复结果到剪贴板。');
}

const handleLinkClick = (event) => {
  console.log('handleLinkClick')

  const target = event.target

  if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')) {
    if (!isUnderRobotMsg(target)) return true

    event.preventDefault();

    const href = target.getAttribute('href');
    window.open(href, '_blank');
  }
}

onMounted(async () => {
  initHistory()
  initAiData()
  document.addEventListener('click', handleLinkClick)
})
onBeforeUnmount(async () => {
  document.removeEventListener('click', handleLinkClick)
})

</script>

<style lang="less" src="./style.less" />
<style lang="less" src="./style-scoped.less" scoped />
