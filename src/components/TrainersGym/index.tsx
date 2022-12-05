import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./index.css";

import { HiPencil, HiTrash } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";

import Loading from "../Loading";

import { editTrainersGymLocation, deleteTrainersGym } from "../../graphQlQuieries";
import { fetchGraphQl } from "../../utils";
import Error from '../Error';
import Notice from '../Notice';


export type Props = {
    id: string;

    location: string;

    trainerToken: string;

    allowLocationChange?: boolean;

    allowDelete?: boolean;
}

const TrainerGym: React.FC<Props> = ({ id, trainerToken, location, allowLocationChange, allowDelete }) => {
    const navigate = useNavigate();
    const [ editing, setEditing ] = useState(false);
    const [ editText, setEditText ] = useState(location);
    const [ loading, setLoading ] = useState(false);

    const [ error, setError ] = useState<any>(null);
    const [ notice, setNotice ] = useState<any>(null);

    const handleDeleteGym = ( ) => {
        setLoading(true);
        fetchGraphQl(deleteTrainersGym, { gymId: id, token: trainerToken })
            .then( (response) => {
                setLoading(false);
                if (response.data) {
                    setNotice("Gym deleted");
                    navigate(0);
                }else {
                    setError(response.errors[0]);
                }
            })
            .catch( (error) => {
                setError(error);
                setLoading(false);
            })
    }

    const handleEditGym = ( ) => {
        setLoading(true);

        fetchGraphQl(editTrainersGymLocation, { token: trainerToken, gymId: id, location: editText })
            .then( (response) => {
                setLoading(false);
                setEditing(false);

                if (response.errors) return setError(response.errors[0]);
                else {
                    setNotice("Location updated!");
                    
                    return navigate(0);
                }
            })
            .catch( (error) => {
                setLoading(false);
                setEditing(false);

                return setError({ message: "Problem Updating Location" });
            }
        )
    }

    if (loading) return <Loading />;

    if (error) return <Error {...error} reload={true}/>;

    if (notice) return <Notice message={notice} onClose={ () => navigate(0) } />;

    return (
        <div className="TrainerGym">
            <div className="container">
                <div className="location">{location}</div>

                <div className="icons">
                    {allowLocationChange && <HiPencil className="icon" onClick={() => setEditing(true)} />}
                    {allowDelete && <HiTrash className="icon" onClick={ () => handleDeleteGym() } />}
                </div> 
            </div>

            {
                editing && (
                    <div className="EditingContainer">
                        <div className="EditProfileInput">
                            <label className="EditProfileInputTitle" htmlFor="homeGym"> Edit Gym Location </label>
                            <input className="EditProfileInputField" type="text" title="homeGym" defaultValue={editText} onChange={
                                (e) => {
                                    setEditText(e.target.value)
                                }
                            }
                            />
                        </div>

                        <div className="icons">
                            <MdCancel className="icon" onClick={() => setEditing(false)} /> 
                            <BsFillCheckCircleFill className="icon" onClick={() => handleEditGym()} />
                        </div>

                    </div>
                )
            }
        </div>
    )
}

TrainerGym.defaultProps = {
    allowLocationChange: true,
    allowDelete: true
}

export default TrainerGym;
