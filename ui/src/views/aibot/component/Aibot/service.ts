import request from '@/utils/request';
import {scrollTo} from "@/utils/dom";

const apiPath = 'aichat';

export async function list_knowledge_bases(serverUrl?: string): Promise<any> {
  const config = {
    url: `/${apiPath}/list_knowledge_base`,
    method: 'GET',
  } as any

  if (serverUrl) {
    config.baseURL = serverUrl
  }

  const ret = request(config)

  return ret
}

export function scroll() {
    setTimeout(() => {
        scrollTo('chat-messages', 0)
    }, 200)
}

export function isUnderRobotMsg(elem) {
  const parent = elem.parentNode
  if (!parent) {
    return false
  }

  if (parent.classList.contains('markdown-container')) {
    return true
  }

  return isUnderRobotMsg(parent)
}

export function getDocDesc(str) {
  if (str.length < 30) {
    return str
  }

  const first = str.substring(0, 21);
  const last = str.substring(str.length - 10);

  return first + ' ... ' + last
}

export function replaceLinkWithoutTitle (str) {
  console.log('replaceLinkWithoutTitle')
  try {
    // html page
    str = str.replace(/\[(\d+)-([^\]]+)\]\([^)]+\.html\)[\d\D]/g,
      '[$2](https://wiki.nancalcloud.com/pages/viewpage.action?pageId=$1)')

    // diffpagesbyversion page
    // ABC (/pages/diffpagesbyversion.action?pageId=5969977&selectedPageVersions=1&selectedPageVersions=2) 123
    str = str.replace(/([^\]])\((\/pages\/.+?\.action\?pageId=.+?)\)/g, '$1[链接](https://wiki.nancalcloud.com$2)')

    // change markdown link to html link.
    // str = str.replace(/([^\]])\((http.+?)\)/g, '$1<a href="$2" target="_blank">$2</a>')

    return str
  } catch(err) {
    console.log('replace error', err)
  }
}

export function getDocLink (source): any {
  // docs/15010286-乐研API - 20231215 - 乐研文档中心 - 技术平台知识库.html

  const regex = /.+?(\d+)-.*\.(html)/g;

  const matches = regex.exec(source);
  if (matches && matches.length > 2) {
    return {pageId: matches[1], pageType: matches[2]}
  }

  return {}
}

export const setSelectionRange = function (ctrl, pos) {
    console.log('setSelectionRange', ctrl, pos)

    setTimeout(() => {
        if (ctrl.setSelectionRange) {
            ctrl.focus()
            ctrl.setSelectionRange(-1, -1)
        } else if (ctrl.createTextRange) {
            const range = ctrl.createTextRange()
            range.collapse(true)
            range.moveEnd('character', pos)
            range.moveStart('character', pos)
            range.select()
        }
    }, 100)
}
