import React from 'react'

import '../../template/index.sass'


export default function({user, onLessonList, onTeamList, onLogout}) {

return <section className="board admin">
        <h4 className="admin__user">{user}</h4>
        <h3 className="admin__lessonlist"><a href="/lessonlist" onClick={event => { event.preventDefault(); onLessonList() }}>Lesson list</a></h3>
        <h3 className="admin__teamlist"><a href="/teamlist" onClick={event => { event.preventDefault(); onTeamList()}}>Team list</a></h3>

        <section className="logo">
        <img className="logo__image" src="./images/ski_silouette_white_shadow.png" alt="skier silouette"/>
        </section>
        <h3 className="admin__logout"><a href="/logout" onClick={event => { event.preventDefault(); onLogout()}}>Logout</a></h3>
    </section>
}
