import React, { useState, useEffect } from 'react';
import '../../../src/template/index.sass'
import Landing from '../Landing'
import Register from '../Register'
import Login from '../Login'
import BoardAdmin from '../BoardAdmin'
import BoardClient from '../BoardClient'
import CreateTeam from '../CreateTeam'
import TeamList from '../TeamList'
import AddLesson from '../AddLesson'
import LessonList from '../LessonList'
import BookLessonList from '../BookLessonList'
import MyCart from '../MyCart'
import Feedback from '../Feedback'



import { Route, withRouter, Redirect } from 'react-router-dom'
import { authenticateUser, registerUser, retrieveUser, retrieveTeams, retrieveLessons, createTeam, addLesson, deleteLesson, clientBookLesson  } from '../../logic'

export default withRouter(function ({ history }) {
    const [name, setName] = useState()
    const [user, setUser] = useState()
    const [teams, setTeams] = useState([])
    const [lessons, setLessons] = useState([])
    const [error, setError] = useState('')
    //const [users, setUsers] = useState()
    //const [role, setRole] = useState()

    useEffect(() => {
        const { token } = sessionStorage;

        (async () => {
            if (token) {
                const { name: _name, username } = await retrieveUser(token)

                setName(_name)

                setUser(username)


                const teams = await retrieveTeams(token)

                setTeams(teams)

                const lessons = await retrieveLessons(token)

                setLessons(lessons)
            }

        })()

    }, [sessionStorage.token, lessons,  error])


    async function listTeams(token) {
        const teams = await retrieveTeams(token)

        setTeams(teams) 

    }

    async function listLessons(token) {
        const lessons = await retrieveLessons(token)

        setLessons(lessons)

    }


    function handleGoToLogin() { history.push('/login')}
    
    function handleGoToRegister() { history.push('/register')}

    async function handleRegister(name, surname, email, username, password) {

        try {

            await registerUser(name, surname, email, username, password )

            history.push('/login')
        

        } catch (error) {

            setError(error.message.toString())
        }
    }

    async function handleLogin(username, password) {
        try {
            const token = await authenticateUser(username, password)

            sessionStorage.token = token

            const user = await retrieveUser(token)
            sessionStorage.role = user.role
            setUser(user)


            user && (user.role === 'admin') && history.push('/board-admin')

            user && (user.role === 'client') && history.push('/board-client')

     
        } catch (error) {
            setError(error.message.toString())
        }
    }


    function handleGoToLessonList() { history.push('/lessonlist'); setLessons(lessons) }

    function handleGoToTeamList() { history.push('/teamlist'); setTeams(teams) }


    async function handleAddLesson(date, timeStart, timeEnd, teamId) {
        try {  
            const token = sessionStorage.token
    
            await addLesson(token, date, timeStart, timeEnd, teamId)
    
            await listLessons(token)

            history.push('/lessonlist')

        } catch (error) {
            setError(error.message.toString())
        }

    }


    async function handleCreateTeam(teamName, teamEmail, teamPhone, teamActivity) {
        try {

            const token = sessionStorage.token

            await createTeam(token, teamName, teamEmail, teamPhone, teamActivity)

            await listTeams(token)

            history.push('/teamlist')

        } catch (error) {
            console.error(error)
        }

    }

    async function handleDeleteLesson(id) {
        try {

            const  token  = sessionStorage.token
            
            
            await deleteLesson(token, id)

            
            history.push('/lessonlist')
            
            const lessons = await retrieveLessons(token)
            
            setLessons(lessons)


        } catch (error) {
            console.error(error)
        }
    }


    function handleGoBack() { 
        setError('')
  
       history.goBack()
    }
 
    function handleLogout() {
        sessionStorage.clear()

        handleGoBack()
    }

    function handleGoToBookLesson() { history.push('/booklessonlist'); setLessons(lessons) }

    async function handleBookLesson(id) { 
        try {

            const  token  = sessionStorage.token

            await clientBookLesson(token, id)

            history.push('/booklessonlist')

            const lessons = await retrieveLessons(token)

            setLessons(lessons)

        } catch (error) {
            console.error(error)
        }

    }
    
    function handleGoToMyCart() { history.push('/my-cart'); setLessons(lessons) }

    async function handleMyCart(id) {
        try { 

        } catch (error) {
            console.error(error)
        }
    }




    const { token, role } = sessionStorage

    return <>
        <Route exact path='/' render={() => token ? <Redirect to='/' /> : <Landing onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
        <Route path='/register' render={() => token ? <Redirect to='/board-client' /> : <Register onRegister={handleRegister} onBack={handleGoBack} error={error} />} />
        <Route path='/login' render={() => token ? <Redirect to='/login' /> : <Login onLogin={handleLogin} onBack={handleGoBack} error={error} />} />
        
        <Route path='/board-admin' render={() => token && role === 'admin' ? <BoardAdmin user={name} onTeamList={handleGoToTeamList} onLessonList={handleGoToLessonList} onBack={handleGoBack} onLogout={handleLogout}/> : <Redirect to='/' /> } />
        
        <Route path='/lessonlist' render={() => token && role === 'admin' ? <LessonList user={name} lessons={lessons} onDeleteLesson={handleDeleteLesson} onBack={handleGoBack}/> : <Redirect to='/' />} />
        <Route path='/teamlist' render={() => token && role === 'admin' ? <TeamList user={name} teams={teams} onCreateTeam={handleCreateTeam} onBack={handleGoBack}/> : <Redirect to='/' />} />
        
        <Route path='/create-team' render={() => token && role === 'admin' ? <CreateTeam user={name} teams={teams} onCreateTeam={handleCreateTeam} error={error} />  : <Redirect to='/' /> } />
        <Route path='/add-lesson' render={() => token && role === 'admin' ? <AddLesson user={name} teams={teams} lessons={lessons} onAddLesson={handleAddLesson} error={error} /> : <Redirect to='/' /> } />
        
        <Route path='/board-client' render={() => token ? <BoardClient user={name} onBookLesson={handleGoToBookLesson} onMyCart={handleGoToMyCart} onLogout={handleLogout} /> : <Redirect to='/' />} />
        <Route path='/booklessonlist' render={() => token ? <BookLessonList user={name} lessons={lessons} error={error} /> : <Redirect to='/' /> }/>
        <Route path='/my-cart' render={() => token ? <MyCart user={name} lessons={lessons}  onMyCart={handleMyCart} error={error} /> : <Redirect to='/' /> }  />

        <Route path='/logout' render={() =>  <Redirect to='/' />  }/>
    </>
})
