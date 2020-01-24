import React from 'react'
import '../../template/index.sass'
import Feedback from '../Feedback'
import { Link } from  'react-router-dom'

export default function({ user, onCreateTeam, error }) {
    return <section className="team-create">
        <h4 className="team-create__user">user: {user}</h4>
        <h3 className="team-create__title">Create TEAM</h3>
        <Link className="team-create__back" to="/teamlist">back to TEAM LIST</Link>
        <form className="team-create__form" onSubmit={function (event) {
            event.preventDefault()

            const { teamName: { value: teamName }, teamEmail: { value: teamEmail }, teamPhone: { value: teamPhone }, teamActivity: { value: teamActivity } } = event.target

            onCreateTeam(teamName, teamEmail, teamPhone, teamActivity)
        }}>
            <input className="team-create__field" type="text" name="teamName"  placeholder="name"/>
            <input className="team-create__field" type="email" name="teamEmail" placeholder="e-mail"/>
            <input className="team-create__field" type="tel" min="9" max="9" name="teamPhone" placeholder="#########"/>
            <input className="team-create__field" type="text" name="teamActivity" placeholder="activity"/>
            <button className="team-create__button">Submit</button>
        </form>

        {error && <Feedback message={error} />}
</section>

}
