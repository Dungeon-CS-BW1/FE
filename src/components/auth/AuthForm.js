import React, {useState} from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {login, register} from '../../store/auth/AuthActions'
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        textAlign: "center",
        justifyContent: 'center',
        height: 400,
        flexDirection: 'column',
        width: '30%',
        minWidth: '200px',
        margin: '10px auto',
    },
    input: {
        color: 'white',
        marginBottom: 10
    },
    btn:{
        background: "#FCEBB9",
        width: "40%",
        margin: '20px auto',
        '&:hover':{
            background: "#fccc92",
        }
    }
})

function AuthForm(props) {
    const classes = useStyles()

    const handleSubmit = e => {
        e.preventDefault()
        props.isLogin
            ? props.login({
                username: credentials.username,
                password: credentials.password
            }, props.history)
            : props.register({
                username: credentials.username,
                password1: credentials.password,
                password2: credentials.password2
            }, props.history)
    }

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        password2: ''
    })

    const handleChange = e => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <form className={classes.root} onSubmit={handleSubmit}>
                <InputLabel htmlFor='username' ><Typography color={'secondary'}>Username:</Typography></InputLabel>
                <Input
                    id='username'
                    type='text'
                    name='username'
                    className={classes.input}
                    value={credentials.username}
                    onChange={handleChange}
                />
                <InputLabel htmlFor='password'><Typography color={'secondary'}>Password:</Typography></InputLabel>
                <Input
                    id='password'
                    type='password'
                    name='password'
                    className={classes.input}
                    value={credentials.password}
                    onChange={handleChange}
                />
                {!props.isLogin && (
                    <>
                        <InputLabel htmlFor='password2'><Typography color={'secondary'}>Confirm Password:</Typography></InputLabel>
                        <Input
                            id='password2'
                            type='password'
                            name='password2'
                            className={classes.input}
                            value={credentials.password2}
                            onChange={handleChange}
                        />
                    </>
                )}

                <Button type='submit' className={classes.btn}>{props.isLogin ? 'Login' : 'Register'}</Button>
            </form>
        </div>
    )
}

export default connect(null, {login, register})(withRouter(AuthForm))
