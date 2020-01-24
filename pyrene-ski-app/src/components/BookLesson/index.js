import React from 'react'
import '../../../src/template/index.sass'
import Feedback from '../Feedback'

export default function ({ lesson: { id, date, timeStart, timeEnd, teamName, activityName }, onBookLesson, error}) {
    return <>
        <a href="/booklessonlist" className={'booking-lesson'}>{/* {id} */}
        <p className="booking-lesson__date">{date}</p>
        <p className="booking-lesson__timeStart margin">{timeStart}</p>
        <p className="booking-lesson__timeEnd margin ">{timeEnd}</p>
        <p className="booking-lesson__teamName margin">{teamName}</p>
        <p className="booking-lesson__teamActivity margin">{activityName}</p>
        <span className="booking-lesson__lessonBooking margin">
            <form method="post" onSubmit={event => { event.preventDefault(); /* onBookLesson(id) */ }}>
                <button type="submit" title="book-button"></button>
            </form>
        </span>
        {error && <Feedback message={error} />}
    </a>
    </>
}