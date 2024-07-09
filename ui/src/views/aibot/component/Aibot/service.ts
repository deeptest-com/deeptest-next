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

export function markToHtml(md){
    if (!md) return ''
    // var mk = "[I'm a link](5969977-提取器 - 乐研文档中心 - 技术平台知识库.html)"

    let html = md

    try {
        // replace markdown link
        html = html.replace(/\[([^\]]+)\]\(((\d+)-[^)]+)\.html\)/,
            '<a href="https://wiki.nancalcloud.com/pages/viewpage.action?pageId=$3" target="_blank">$1</a>')

        html = urlToLink(html)
    }
    catch(err) {
        console.log('replace error', err)
    }

    return html
}

export function urlToLink (str){
    try {
        // replace url text to link
        str = str.replace(/([^=].)(https:\/\/wiki.nancalcloud.com\/pages\/viewpage.action\?pageId=\d+)([^\d]+?)/,
            '$1<a href="$2" target="_blank">链接</a>$3')
    }
    catch(err) {
        console.log(err)
    }

    return str
}

export function docToHtml (md){
    if (!md) return ''
    // var doc = "出处 [1] [5973752-hookman安装包下载 - 乐研文档中心 - 技术平台知识库.html](http://127.0.0.1:7861/knowledge_base/download_doc?knowledge_base_name=poc&file_name=5973752-hookman%E5%AE%89%E8%A3%85%E5%8C%85%E4%B8%8B%E8%BD%BD+-+%E4%B9%90%E7%A0%94%E6%96%87%E6%A1%A3%E4%B8%AD%E5%BF%83+-+%E6%8A%80%E6%9C%AF%E5%B9%B3%E5%8F%B0%E7%9F%A5%E8%AF%86%E5%BA%93.html) \n\nGo to start of banner (#page-banner-start)    hookman安装包下载 (/pages/viewpage.action?pageId=5973752)          Skip to end of metadata (#page-metadata-end)     Created by  马国良 (    /display/~magl ) on Nov 01, 2023\n\n"

    let html = md.replace('出处 [1] ', '知识库：')

    try {
        // replace doc link
        html = html.replace(/\[(\d+)-([^\]]+)\]\([^)]+\.html\)[\d\D]*$/,
            '<a href="https://wiki.nancalcloud.com/pages/viewpage.action?pageId=$1" target="_blank">$2</a>')

        console.log(html)
    }
    catch(err) {
        console.log('replace error', err)
    }

    return html
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
