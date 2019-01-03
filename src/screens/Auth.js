import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert
} from 'react-native'
import commonStyles from '../commonStyles'
import backgroundImage from '../../assets/imgs/Login.jpg'

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

    signinOrSignup = () => {
        if (this.state.stageNew) {
            Alert.alert('Sucesso!', 'Criar conta')
        } else {
            Alert.alert('Sucesso', 'Logar')
        }
    }

    render() {
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
                        <TextInput
                            placeholder='Nome'
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={name = this.setState({ name })} />}
                    {/* esse é o input do email e depois o de senha. 
                    eles sempre estão presentes então não precisam de condicional */}
                    <TextInput
                        placeholder='E-mail'
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput
                        placeholder='Senha'
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    {/* agora outra renderização condicional. agora para a confirmação
                    da senha na hora do cadastro */}
                    {this.state.stageNew &&
                        <TextInput
                            placeholder='Confirme a senha'
                            style={styles.input}
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
                    <TouchableOpacity onPress={this.signinOrSignup}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Regristrar' : 'Entrar'}
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

})