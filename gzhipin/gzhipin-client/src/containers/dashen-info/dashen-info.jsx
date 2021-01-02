import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, InputItem, TextareaItem, Button ,WhiteSpace} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import {updateUser} from '../../redux/actions'
import HeaderSelector from '../../components/header-selector/header-selector'
class DashenInfo extends Component {
    state = {
        header:'',
        post:'',
        info:''
    }
    // 更新header状态
    setHeader = (header) =>{
        this.setState({
            header
        })
    }
    // 更新info和post的状态
    handleChange = (name,value) =>{
        this.setState({
            [name]:value
        })
    }
    save = ()=>{
        this.props.updateUser(this.state)
    }
    render() {
        // 如果信息已经完善自动重定向到主界面
        const {header,type} = this.props.user
        if(header) {
            const path = type==='dashen'? '/dashen' : '/laoban'
            return <Redirect to={path} />
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
                <InputItem placeholder='请输入求职岗位'onChange={val=> {this.handleChange('post',val)}}>求职职位：</InputItem>
                <TextareaItem title="个人介绍" rows={3}  onChange={val=> {this.handleChange('info',val)}}/>
                <WhiteSpace/>
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {updateUser}
)(DashenInfo)