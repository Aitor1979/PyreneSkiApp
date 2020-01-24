import React from 'react'
import '../../../src/template/index.sass'
import BookLesson from '../BookLesson'
import { Link } from 'react-router-dom' 


export default function({user, lessons, onBookLesson }) {

return <>

    <h4 className="booking-list booking-list__user">user: {user}</h4>
        <section className="booking-list booking-list__nav">
            <Link className="booking-list booking-list__back" to="/board-client">Go Back</Link>
       </section>
    <ul className="booking-list booking-list__title">LESSON LIST TO BOOK
    {lessons.map(lesson => <li className="booking-list__item" key={lesson.id}>{ <BookLesson lesson={lesson} onBookLesson={onBookLesson} /> }</li>)}
    </ul>
        </>
}

