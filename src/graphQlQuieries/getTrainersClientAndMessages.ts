export const getTrainersClientAndMessages = `
query GetTrainersClientAndMessages($clientId: String!, $token: String!) {
    getTrainersClientAndMessages(clientId: $clientId, token: $token) {
      dateCreated
      messages {
        id
        createdAt
        message
        metaDataType
        status
        timeRead
        whoSent
      }
      name
      profilePicture
      trainersDecision
      canSeeUserFoodHistory
      notes {
        id
        note
        createdAt
        updatedAt
      }
      food {
        id
        name
        adminCreated
        servingSize {
          measurment
          unit
        }
        calories
        nutritionFacts {
          totalFat {
            measurment
            unit
          }
          saturatedFat {
            measurment
            unit
          }
          transFat {
            measurment
            unit
          }
          cholesterol {
            measurment
            unit
          }
          sodium {
            measurment
            unit
          }
          totalCarbohydrate {
            measurment
            unit
          }
          dietaryFiber {
            measurment
            unit
          }
          totalSugars {
            measurment
            unit
          }
          addedSugars {
            measurment
            unit
          }
          protein {
            measurment
            unit
          }
          vitaminD {
            measurment
            unit
          }
          calcium {
            measurment
            unit
          }
          iron {
            measurment
            unit
          }
          potassium {
            measurment
            unit
          }
        }
    }
    }
  }
`;
