import { Link } from 'react-router-dom'
import React from 'react'
import '../../../src/template/index.sass'
import Feedback from '../Feedback'


export default function({error}) {

return <section className="mycart__section">
    <Link className="mycart__back" to="/board-client">Go Back</Link>

{error && <Feedback message={error} />} 
</section>
}