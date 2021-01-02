// 能发送ajax请求函数的模块函数的返回值是promise对象
import axios from 'axios'
export default function ajax(url,data={},type='GET') {
    if (type==='GET') {//发送GET请求
        // 拼请求参数的串
        // data:{username:tom,password:123}
        //paramsStr=username=tom&password=123
        let paramsStr = ''
        Object.keys(data).forEach(key => {
            paramsStr += key + '=' + data[key] + '&'
        })
        if(paramsStr) {
            paramsStr = paramsStr.substring(0,paramsStr.length-1)
        }
        //使用axios发送get请求
        return axios.get(url + '?' + paramsStr)
    } else {//发送POST请求
        return axios.post(url,data)
    }
    
}