from flask import Flask, render_template, request
import numpy as np
from sklearn.linear_model import LinearRegression
import random

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def index():
	if request.method == "GET":
		return render_template("index.html")


	if request.method == "POST":
		#rates is the amount of people in poverty
		rates = list(map(int, (request.form.get("rates").split())))
		#years is the year that that poverty number exists
		years = list(map(int, (request.form.get("years").split())))

		def predict(years, nums, iteration):
			x = np.array(years).reshape(-1, 1)
			y = np.array(nums)
			reg = LinearRegression()
			reg.fit(x, y)
			slope = reg.coef_[0]
			y_intercept = reg.intercept_
			return (slope * iteration) + y_intercept

		allPredictions = ""
		allPredictions += str(rates[len(rates) - 1]) + " "
		allYears = ""

		#incorporate margin or error of in any given year

		for i in range(len(rates) - 9):
			prediction = predict(years[-10:], rates[-10:], (2021 + i))

			minima = min(rates)
			maxima = max(rates)
			MOE = round((maxima/minima) * (maxima/100))

			MOE = random.randint((-1 * MOE), MOE)

			allPredictions += str(round(prediction) + MOE) + " "
			allYears += str(2020 + i) + " "

		#send the data to javascript
		return {
			"status": "success",
			"predictions": allPredictions,
			"years": allYears
		}


if __name__ == "__main__":
	app.run()
