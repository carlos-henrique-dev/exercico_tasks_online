import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native'
import moment from 'moment'
import axios from 'axios'
import 'moment/locale/pt-br'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionBUtton from 'react-native-action-button'
import AddTask from './AddTaks'
import { server, showError } from '../common'

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

export default class Agenda extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tasks: [],
            visibleTasks: [],
            showDoneTasks: true,
            showAddTask: false,
        }
    }

    addTask = async task => {
        try {
            await axios.post(`${server}/tasks`, {
                desc: task.desc,
                estimateAt: task.date
            })
            this.setState({ showAddTask: false }, this.loadTasks)
        } catch (err) {
            showError(err)
        }
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
    }

    toggleFilter = () => {
        this.setState({
            showDoneTasks: !this.state.showDoneTasks
        },
            this.filterTasks
        )
    }

    /* assim que o componente for montado, ele vai chamar essa função
    para começar a filtrar as tarefas */
    componentDidMount = async () => {
        this.loadTasks()
    }

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await this.loadTasks()
        } catch (err) {

        }
    }

    loadTasks = async () => {
        try {
            const maxDate = moment()
                .add({ days: this.props.daysAhead })
                .format('YYYY-MM-DD 23:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks)
        } catch (err) {
            showError(err)
        }
    }

    render() {
        let styleColor = null
        let image = null

        switch (this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break
            case 1:
                styleColor = commonStyles.colors.tomorrow
                image = tomorrowImage
                break
            case 7:
                styleColor = commonStyles.colors.week
                image = weekImage
                break
            default:
                styleColor = commonStyles.colors.month
                image = monthImage
                break
        }

        return (
            <View style={styles.container}>

                <AddTask
                    isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })}
                />

                <ImageBackground source={image} style={styles.background}>

                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={20} color={commonStyles.colors.secundary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon
                                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={20}
                                color={commonStyles.colors.secundary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>
                            {this.props.title}
                        </Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>

                </ImageBackground>

                <View style={styles.taskContainer}>

                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) =>
                            <Task {...item} toggleTask={this.toggleTask}
                                onDelete={this.deleteTask} />}
                    />

                </View>

                <ActionBUtton
                    buttonColor={styleColor}
                    onPress={() => this.setState({ showAddTask: true })}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secundary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,

    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secundary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taskContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})