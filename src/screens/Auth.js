import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert
} from 'react-native'
import axios from 'axios'
import { server, showError } from '../common'
import commonStyles from '../commonStyles'
import backgroundImage from '../../assets/imgs/login.jpg'
import Authinput from '../components/Authinput'

export default class Auth extends Component {
    state = {
        /* se o stageNew for true, quer dizer que o usuário está se cadastrando
        se for false, siginifica que o usuário está logando */
        stageNew: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,

            })
            /* a partir de agora, todas as requisições usando o axios
            terão esse header abaixo, pois dessa forma é possível autenticar as requisições
            e confirmar se o usuário pode ou não realizar determinada ação. */
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            /* dando tudo certo, eu chamo a classe anterior e falo pra mudar
            pra tela Home */
            this.props.navigation.navigate('Home', res.data)
        } catch (err) {
            Alert.alert('Erro', 'Falha no login!')
            //showError(err)
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!')
            this.setState({ stageNew: false })
        } catch (err) {
            showError(err)
        }
    }

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    render() {
        const validations = []

        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)
        if (this.state.stageNew) {
            validations.push(this.state.name & this.state.name.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <ImageBackground
                source={backgroundImage}
                style={styles.background}
            >
                <Text style={styles.title}> Tasks</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {/* esse Text recebe um texto condicional
                    pra quando for um stageNew: true ou false */}
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {/* aqui faz uma renderização condicional. se this.state.stageNew == false
                    ele pula e nem renderiza o resto, 
                    se for true, ele renderiza o textInput do nome
                    aqui ele usa essa operação pq pode precisar do input do nome ou não */}
                    {this.state.stageNew &&
                        <Authinput
                            icon='user'
                            placeholder='Nome'
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })} />}
                    {/* esse é o input do email e depois o de senha. 
                    eles sempre estão presentes então não precisam de condicional */}
                    <Authinput
                        icon='at'
                        placeholder='E-mail'
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />

                    <Authinput
                        icon='lock'
                        secureTextEntry={true}
                        placeholder='Senha'
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    {/* agora outra renderização condicional. agora para a confirmação
                    da senha na hora do cadastro */}
                    {this.state.stageNew &&
                        <Authinput
                            icon='asterisk'
                            secureTextEntry={true}
                            placeholder='Confirme a senha'
                            style={styles.input}
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />}

                    <TouchableOpacity
                        disabled={!validForm}
                        onPress={this.signinOrSignup}>
                        <View
                            style={[styles.button, !validForm ? { backgroundColor: '#AAA' } : {}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    }
})