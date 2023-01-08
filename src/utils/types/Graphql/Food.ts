export declare enum NutritionUnits {
    mL = "mL",
    mcg = "mcg",
    L = "L",
    dL = "dL",
    t = "t",
    tsp = "tsp",
    tbsp = "tbsp",
    gill = "gill",
    cup = "cup",
    pt = "pt",
    qt = "qt",
    gal = "gal",
    mg = "mg",
    g = "g",
    kg = "kg",
    lb = "lb",
    oz = "oz",
    can = "can",
    percent = "%"
}
export declare type NutritionFactsJson = {
    measurment: number;
    unit: NutritionUnits;
};
export declare type NutritionFacts = {
    totalFat: NutritionFactsJson;
    saturatedFat: NutritionFactsJson;
    transFat: NutritionFactsJson;
    cholesterol: NutritionFactsJson;
    sodium: NutritionFactsJson;
    totalCarbohydrate: NutritionFactsJson;
    dietaryFiber: NutritionFactsJson;
    totalSugars: NutritionFactsJson;
    addedSugars: NutritionFactsJson;
    protein: NutritionFactsJson;
    vitaminD: NutritionFactsJson;
    calcium: NutritionFactsJson;
    iron: NutritionFactsJson;
    potassium: NutritionFactsJson;
};
export declare type NutritionFactsInput = {
    totalFat?: NutritionFactsJson;
    saturatedFat?: NutritionFactsJson;
    transFat?: NutritionFactsJson;
    cholesterol?: NutritionFactsJson;
    sodium?: NutritionFactsJson;
    totalCarbohydrate?: NutritionFactsJson;
    dietaryFiber?: NutritionFactsJson;
    totalSugars?: NutritionFactsJson;
    addedSugars?: NutritionFactsJson;
    protein?: NutritionFactsJson;
    vitaminD?: NutritionFactsJson;
    calcium?: NutritionFactsJson;
    iron?: NutritionFactsJson;
    potassium?: NutritionFactsJson;
};
export declare type Food = {
    id: string;
    name: string;
    calories: number;
    servingSize: NutritionFactsJson;
    nutritionFacts: NutritionFacts;
    adminCreated: boolean;
};
