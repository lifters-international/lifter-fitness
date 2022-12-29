export const getTrainerVideoAnaylsis = `
query GetTrainerVideoAnalytics($videoId: String!, $token: String!) {
    getTrainerVideoAnalytics(videoId: $videoId, token: $token) {
      engagementCategory {
        NonClientEngagement
        clientEngagement
        totalEngagement
      }
      likesAndDislikesCategory {
        disLikes {
          clientDislike
          nonClientDislike
        }
        likes {
          clientLikes
          nonClientLikes
        }
      }
      totalViews
      viewCategory {
        views {
          age {
            above18under30
            above30under50
            above50
            under18
          }
          client {
            clientViews
            nonClientViews
          }
          gender {
            femaleViews
            maleViews
            other
          }
        }
        months {
          lastMonthClientViews
          lastMonthNonClientViews
          lastMonthViews
          thisMonthClientViews
          thisMonthNonClientViews
          thisMonthViews
        }
      }
      watchTime {
        averageClientWatchTime
        averageNonClientWatchTime
        averageWatchTime
      }
    }
  }
`;
