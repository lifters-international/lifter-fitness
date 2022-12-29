import React, { useMemo } from 'react';

import { useParams } from "react-router-dom";

import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";

import { Loading, Error, AlertPrompt, AlertPromptProps, LabelInputDiv, RegisterButton } from "../../components";

import { VictoryBar, VictoryChart, VictoryPie } from 'victory'

import { useGetTrainerVideoAnaylsis } from "../../hooks";

import { shortenNumber } from "../../utils"

type Props = {
    token: string;
}

export const VideoAnaylsis: React.FC<Props> = ({ token }) => {
    let { videoId } = useParams();
    let videoAnaylsis = useGetTrainerVideoAnaylsis(token, videoId as string);

    if (videoAnaylsis.loading) return <Loading />;

    if (videoAnaylsis.error) return <Error message="Problem getting video analysis from server" reload={true} />;

    let getTimeStamp = (time: number) => {
        let durationSummary = new Date(time * 1000).toISOString().substring(11, 19);

        return durationSummary.substring(0, 3) === "00:" ? durationSummary.substring(3) : durationSummary;
    }

    let percentageChange = (oldNumber: number, newNumber: number) => {
        var decreaseValue = newNumber - oldNumber;

        return oldNumber === 0 ? newNumber : (decreaseValue / (oldNumber)) * 100;
    }

    const viewsIncrease = percentageChange(
        videoAnaylsis.anaylsis?.viewCategory.months.lastMonthViews!,
        videoAnaylsis.anaylsis?.viewCategory.months.thisMonthViews!
    );

    const totalLikes = (
        videoAnaylsis.anaylsis?.likesAndDislikesCategory.likes.clientLikes!
        +
        videoAnaylsis.anaylsis?.likesAndDislikesCategory.likes.nonClientLikes!
    );

    const totalDislikes = (
        videoAnaylsis.anaylsis?.likesAndDislikesCategory.disLikes.clientDislike!
        +
        videoAnaylsis.anaylsis?.likesAndDislikesCategory.disLikes.nonClientDislike!
    )

    return (
        <div className="VideoAnaylsis">
            <div className="summary-container">
                <div className="sum">
                    <div className="title" title="Total Views">Total Views</div>

                    <div className="count" title={shortenNumber(videoAnaylsis.anaylsis?.totalViews!)}>
                        {shortenNumber(videoAnaylsis.anaylsis?.totalViews!)}
                    </div>
                </div>

                <div className="sum">
                    <div className="title" title="Average Watch Time">Average Watch Time</div>

                    <div className="count" title={`${videoAnaylsis.anaylsis?.watchTime.averageWatchTime}`}>
                        {getTimeStamp(videoAnaylsis.anaylsis?.watchTime.averageWatchTime!)}
                    </div>
                </div>

                <div className="sum">
                    <div className="title" title="This Month Views">This Month Views</div>

                    <div className="count" title={shortenNumber(videoAnaylsis.anaylsis?.viewCategory.months.thisMonthViews!)}>
                        {shortenNumber(videoAnaylsis.anaylsis?.viewCategory.months.thisMonthViews!)}
                    </div>

                    <div className={`hover ${viewsIncrease > 0 ? "up" : "down"}`}>
                        {
                            viewsIncrease > 0 ? <FaArrowAltCircleUp className="indicator" size={30} /> : <FaArrowAltCircleDown className="indicator" size={30} />
                        }

                        <div className="inc">
                            {
                                percentageChange(
                                    videoAnaylsis.anaylsis?.viewCategory.months.lastMonthViews!,
                                    videoAnaylsis.anaylsis?.viewCategory.months.thisMonthViews!
                                )
                            }%
                        </div>
                    </div>
                </div>


                <div className="sum">
                    <div className="title" title="Total Likes">Total Likes</div>

                    <div className="count" title={`${shortenNumber(totalLikes)} likes`}>{shortenNumber(totalLikes)}</div>
                </div>

                <div className="sum">
                    <div className="title">Total Dislikes</div>

                    <div className="count" title={`${shortenNumber(totalDislikes)} dislikes`}>{shortenNumber(totalDislikes)}</div>
                </div>
            </div>

            <div className="pieContainer">
                <div className="pies">
                    <div className="title">Gender</div>

                    <div className="pie">
                        <VictoryPie
                            innerRadius={75}
                            data={[
                                { x: "Male", y: videoAnaylsis.anaylsis?.viewCategory.views.gender.maleViews},
                                { x: "Female", y: videoAnaylsis.anaylsis?.viewCategory.views.gender.femaleViews },
                                { x: "Other", y: videoAnaylsis.anaylsis?.viewCategory.views.gender.other}
                            ]}
                        />
                    </div>
                </div>

                <div className="pies">
                    <div className="title">Client vs Non-Client likes</div>

                    <div className="pie">
                        <VictoryPie
                            innerRadius={75}
                            data={[
                                { x: "Client", y: videoAnaylsis.anaylsis?.likesAndDislikesCategory.likes.clientLikes},
                                { x: "Non", y: videoAnaylsis.anaylsis?.likesAndDislikesCategory.likes.nonClientLikes},
                            ]}
                        />
                    </div>
                </div>

                <div className="pies">
                    <div className="title">Client vs Non-Client Dislikes</div>

                    <div className="pie">
                        <VictoryPie
                            innerRadius={75}
                            data={[
                                { x: "Client", y: videoAnaylsis.anaylsis?.likesAndDislikesCategory.disLikes.clientDislike},
                                { x: "Non", y: videoAnaylsis.anaylsis?.likesAndDislikesCategory.disLikes.nonClientDislike},
                            ]}
                        />
                    </div>
                </div>

                <div className="pies">
                    <div className="title">Client vs Non-Client Engagement</div>

                    <div className="pie">
                        <VictoryPie
                            innerRadius={75}
                            data={[
                                { x: "Client", y: videoAnaylsis.anaylsis?.engagementCategory.clientEngagement},
                                { x: "Non", y: videoAnaylsis.anaylsis?.engagementCategory.NonClientEngagement},
                            ]}
                        />
                    </div>
                </div>
            </div>


            <div className="chartsContainer">
                <div className="charts">
                    <div className="title">Age</div>

                    <div className="chart">
                        <VictoryChart
                            domainPadding={30}
                        >
                            <VictoryBar
                                style={{ data: { fill: "#FF3636" } }}
                                alignment="middle"
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                barRatio={0.1}
                                data={[
                                    { x: "0-18", y: videoAnaylsis.anaylsis?.viewCategory.views.age.under18 },
                                    { x: "18-30", y: videoAnaylsis.anaylsis?.viewCategory.views.age.above18under30 },
                                    { x: "30-50", y: videoAnaylsis.anaylsis?.viewCategory.views.age.above30under50 },
                                    { x: "50+", y: videoAnaylsis.anaylsis?.viewCategory.views.age.above50 }
                                ]}
                            />
                        </VictoryChart>
                    </div>
                </div>

                <div className="charts">
                    <div className="title">Average View Retention Client vs Non-Clients</div>

                    <div className="chart">
                        <VictoryChart
                            domainPadding={30}
                        >
                            <VictoryBar
                                style={{ data: { fill: "#FF3636" } }}
                                alignment="middle"
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                barRatio={0.1}
                                data={[
                                    { x: "Client", y: videoAnaylsis.anaylsis?.watchTime.averageClientWatchTime },
                                    { x: "Non-Client", y: videoAnaylsis.anaylsis?.watchTime.averageNonClientWatchTime }
                                ]}
                            />
                        </VictoryChart>
                    </div>
                </div>

                <div className="charts">
                    <div className="title">Client vs Non-Client Views</div>

                    <div className="chart">
                        <VictoryChart
                            domainPadding={30}
                        >
                            <VictoryBar
                                style={{ data: { fill: "#FF3636" } }}
                                alignment="middle"
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                barRatio={0.1}
                                data={[
                                    { x: "Client", y: videoAnaylsis.anaylsis?.viewCategory.views.client.clientViews },
                                    { x: "Non-Client", y: videoAnaylsis.anaylsis?.viewCategory.views.client.nonClientViews }
                                ]}
                            />
                        </VictoryChart>
                    </div>
                </div>

                <div className="charts">
                    <div className="title">Monthly Views</div>

                    <div className="chart">
                        <VictoryChart
                            domainPadding={30}
                        >
                            <VictoryBar
                                style={{ data: { fill: "#FF3636" } }}
                                alignment="middle"
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                barRatio={0.1}
                                data={[
                                    { x: "LMC", y: videoAnaylsis.anaylsis?.viewCategory.months.lastMonthClientViews },
                                    { x: "TMC", y: videoAnaylsis.anaylsis?.viewCategory.months.thisMonthClientViews },
                                    { x: "LMNC", y: videoAnaylsis.anaylsis?.viewCategory.months.lastMonthNonClientViews },
                                    { x: "TMNC", y: videoAnaylsis.anaylsis?.viewCategory.months.thisMonthNonClientViews },
                                    { x: "LMV", y: videoAnaylsis.anaylsis?.viewCategory.months.lastMonthViews },
                                    { x: "TMV", y: videoAnaylsis.anaylsis?.viewCategory.months.thisMonthViews }
                                ]}
                            />
                        </VictoryChart>
                    </div>
                </div>
            </div>

        </div>
    )
}
