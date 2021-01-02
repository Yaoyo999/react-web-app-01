// 主界面路由
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie' //可以操作前端cookie的对象 set()/remove()/get()
import { NavBar } from 'antd-mobile'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laobao from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../../containers/chat/chat'

import { getRedirectTo } from '../../utils/index'
import { getUser } from '../../redux/actions'


class Main extends Component {

    //给组件对象添加属性不加static 给组件内添加属性需要加static
    navList = [//包含所有导航组件的相关信息数据
        {
            path: '/laoban',
            component: Laobao,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '个人中心',
            icon: 'personal',
            text: '个人'
        },
    ]

    componentDidMount() {
        //登陆过（cookie中有userid),但还没有登录(redux管理的user中没有_id 发请求获取对应的user
        const userid = Cookies.get('userid')
        const { _id } = this.props.user
        if (userid && !_id) {
            //发送异步请求，获取user信息
            // console.log('发送ajax请求，获取user');
            this.props.getUser()
        }


    }
    render() {

        // 读取cookie中的userid 
        const userid = Cookies.get('userid')
        // 如果没有，自动重定向到登录界面
        if (!userid) {
            return <Redirect to='/login' />
        }
        //如果有,读取redux中的user状态
        const { user,unReadCount } = this.props
        // 如果user没有_id,返回null，不做任何提示
        if (!userid) {
            return null
        } else {
            // 如果有_id，显示对应的界面
            // 根据user的type和header来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname //该属性是看当前的路径
            if (path === '/') {
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path} />
            }
        }

        const { navList } = this
        const path = this.props.location.pathname
        const currentNav = navList.find(nav => nav.path === path) //得到当前的nav，可能没有只有path匹配的时候才有currentNav
        if (currentNav) {
            // 决定哪个路由需要隐藏
            if (user.type === 'laoban') {
                // 隐藏第二个
                navList[1].hide = true
            } else if (user.type === 'dashen') {
                // 隐藏第一个
                navList[0].hide = true
            }
        }
        return (
            <div>
                {currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component} key={nav.path}></Route>)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound} />
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user ,unReadCount:state.chat.unReadCount}),
    { getUser }
)(Main)

// 1.实现自动登录:componentDidMount()
//     1）.登陆过(cookie中有userid),但还没有登录（redux管理的user中没有_id） 发请求获取对应的user
// 2.render()
//     1).如果cookie中没有userid,直接重定向到login登录界面
//     2).判断redux管理的user中是否有_id，如果没有，暂时不做显示
//     3）.如果有，说明当前已经登录，显示对应的界面
//     4）.根据请求根路径，根据user中的type和header来计算出一个重定向的路由路径，并自动重定向