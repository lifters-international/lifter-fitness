import React, { useState, useEffect } from 'react';

import Loading from "../Loading";
import Error from "../Error";

import { getTrainerStripeDashBoardLoginLink } from "../../graphQlQuieries";
import { fetchGraphQl } from "../../utils";

import { FaDumbbell } from "react-icons/fa";
import { MdVideoSettings, MdPersonPin, MdMonetizationOn } from "react-icons/md";

import "./index.css";

export type Props = {
    token: string;
}

const NavBar : React.FC<Props> = ({ token }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const [ dashBoardLink, setDashboardLink] = useState<string>("");

    useEffect( () => {
        if (token) {
            fetchGraphQl(getTrainerStripeDashBoardLoginLink, { token })
                .then( (response) => {
                    if (response.data) {
                        setDashboardLink(response.data.getTrainerStripeDashBoardLoginLink);
                    }
                    setLoading(false);
                })
                .catch( (error) => {
                    setError(error);
                    setLoading(false);
                })
        }

    }, [token]);

    if (loading) return <Loading />;
    if (error) return <Error {...error} reload={true}/>;

    return (
        <div className="NavBar">
            <a href="/"><FaDumbbell size={60} className="home"/></a>

            <div className="seperator">

                <a href={dashBoardLink} target="_blank" rel="noopener noreferrer" > <MdMonetizationOn size={40} color="#FF3636"/> </a>

                <a href="/clients"> <MdPersonPin size={40} color="#FF3636" /> </a>

                <a href="/videos"> <MdVideoSettings size={40} color="#FF3636" /> </a>

                <a href="/profile"> <FaDumbbell size={40} color="#FF3636" /> </a>
            </div>
        </div>
    )
}

export default NavBar;
