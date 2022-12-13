import React, { useState, useEffect } from 'react';

import Loading from "../Loading";
import Error from "../Error";

import { getTrainerStripeDashBoardLoginLink } from "../../graphQlQuieries";
import { fetchGraphQl } from "../../utils";

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
            <a href="/">Home</a>

            <div className="seperator">

                <a href={dashBoardLink} target="_blank" rel="noopener noreferrer" >Dashboard</a>

                <a>Clients</a>

                <a href="/videos">Videos</a>

                <a href="/profile/preview">Profile Preview</a>
            </div>
        </div>
    )
}

export default NavBar;
