const axios = require("axios");
const WEATHER = require("../../models/Weather");
require('dotenv').config({path: "./../../../.env"});

const baseURL = "http://api.openweathermap.org/data/2.5/weather";

class Weather {
     /**
     * Gets the weather data based on the zipcode and which temp system to converge to (imperial/metric system)
     *
     * @param {number} zipCode The zipcode used to get the weather info from the weather api
     * @param {string} tempMetric This is either "imperial" (use Fahrenheit) or "metric" (use Celsius)
     * @return {JSON} The data response from the weather api call.
     */
      async getWeatherData(zipCode, tempMetric) {
          const WEATHER_KEY = process.env.WEATHER_KEY
          console.log(WEATHER_KEY)
          return (await axios(`${baseURL}?zip=${zipCode},us&units=${tempMetric}&appid=${WEATHER_KEY}`)).data
      }

         /**
     * Saves the weather data using the zipcode as the unique identifier
     * If it already exists, replace, if not, then add.
     *
     * @param {number} zipCode The zipcode used to identify the document to upsert
     * @param {string} data Weather data to save/update
     * @return {JSON} The data response from the weather api data.
     */
     async saveWeatherDataToMongo(zipCode, data) {
      const filter = {
          zip: zipCode
      }

      const replace = {
          ...filter,
          ...data,
          data: Date.now()
      }
      await this.findOneReplace(filter, replace);
  }

  /**
   * Saves Weather data to MongoDb
   *
   * @param {number} zipCode The zipcode used as unique identifier to find the document from mongo
   * @return {JSON} The data response from the mongodb.
   */
  async getWeatherDataFromMongo(zipCode) {
      return WEATHER.findOne({zip: zipCode});
  }

  /**
   * If a document already exists with the filter, then replace, if not, add.
   *
   * @param {{zip: number}} filter The filter is the zipcode used as unique identifier to find the document from mongo
   * @return {JSON} The data response from the mongodb.
   */
  async findOneReplace(filter, replace) {
      await WEATHER.findOneAndReplace(filter, replace, {new: true, upsert: true});
  }
    
}

module.exports = Weather;