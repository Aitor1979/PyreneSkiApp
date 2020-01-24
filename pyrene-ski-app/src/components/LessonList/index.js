import React from 'react'
import '../../../src/template/index.sass'
import Lesson from '../Lesson'
import { Link } from 'react-router-dom'


export default function({user, lessons, onDeleteLesson, onBack }){

return <>
    <h4 className="lesson-list lesson-list__user">user: {user}</h4>
        <section className="lesson-list lesson-list__nav">
            <Link className="lesson-list lesson-list__addLesson" to="/add-lesson">Add new Lesson</Link>
            <Link className="lesson-list lesson-list__back" to="/board-admin">Go Back</Link>
       </section>
    <ul className="lesson-list lesson-list__title">LESSON LIST
    {lessons.map(lesson => <li className="lesson-list__item" key={lesson.id}>{ <Lesson lesson={lesson} onDeleteLesson={onDeleteLesson} /> }</li>)}
    </ul>

</>
    } 