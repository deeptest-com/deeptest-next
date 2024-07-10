import{_ as c}from"./BasicForm.vue_vue_type_script_setup_true_lang-orwvgdDw.js";import"./BasicForm.vue_vue_type_style_index_0_lang-QagiLVow.js";import"./componentMap-y3geBe7X.js";import{C as d,b as f}from"./entry/index-DAalq45t.js";import{P as _}from"./index-RjhMGX4w.js";import{M as a,C as i}from"./index-V0XSZzIl.js";import{d as g,_ as b,a9 as C,aa as n,k as s,u as o,l as p}from"./vue-CcYFxcV9.js";import"./FormItem.vue_vue_type_script_lang-DnHsc02o.js";import"./helper-D8h8MC8x.js";import"./antd-Dz9J5sbH.js";import"./index-DefgKiDf.js";import"./useWindowSizeFn-CUf2CWbb.js";import"./useFormItem-OeJH_75l.js";import"./RadioButtonGroup.vue_vue_type_script_setup_true_lang-Z_atOqpK.js";import"./index-B5_Jkfoz.js";import"./uuid-D0SLUWHI.js";import"./useSortable-qlEV-cB0.js";import"./download-BBlB6oUH.js";import"./base64Conver-bBv-IO2K.js";import"./index-BR_VGY3r.js";import"./IconPicker.vue_vue_type_script_setup_true_lang-Dy4DZGOA.js";import"./copyTextToClipboard-YILaghJg.js";import"./index-BI9WM7sX.js";import"./index-Cij_bpvD.js";import"./useContentViewHeight-CtxjnFvm.js";import"./onMountedOrActivated-i2dQEfK9.js";const G=g({__name:"Editor",setup(h){const m=[{field:"title",component:"Input",label:"title",defaultValue:"标题",rules:[{required:!0}]},{field:"JSON",component:"Input",label:"JSON",defaultValue:`{
        "name":"BeJson",
        "url":"http://www.xxx.com",
        "page":88,
        "isNonProfit":true,"
        address:{ 
            "street":"科技园路.",
            "city":"江苏苏州",
            "country":"中国"
        },
}`,rules:[{required:!0,trigger:"blur"}],render:({model:e,field:t})=>p(i,{value:e[t],mode:a.JSON,onChange:r=>{e[t]=r},config:{tabSize:10}})},{field:"PYTHON",component:"Input",label:"PYTHON",defaultValue:`def functionname( parameters ):
   "函数_文档字符串"
   function_suite
   return [expression]`,rules:[{required:!0,trigger:"blur"}],render:({model:e,field:t})=>p(i,{value:e[t],mode:a.PYTHON,onChange:r=>{e[t]=r}})}],{createMessage:u}=f();function l(e){u.success("click search,values:"+JSON.stringify(e))}return(e,t)=>(b(),C(o(_),{title:"代码编辑器组件嵌入Form示例"},{default:n(()=>[s(o(d),{title:"代码编辑器组件"},{default:n(()=>[s(o(c),{labelWidth:100,schemas:m,actionColOptions:{span:24},baseColProps:{span:24},onSubmit:l})]),_:1})]),_:1}))}});export{G as default};
