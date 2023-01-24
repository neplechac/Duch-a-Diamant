from os import path
from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

ROOT = path.dirname(path.realpath(__file__))


@app.route("/", methods=["GET", "POST"])
def duch():
    if request.method == "POST":
        name = request.form.get("name")
        score = request.form.get("score")
        streak = request.form.get("streak")
        time = request.form.get("time")

        try:
            with sqlite3.connect(path.join(ROOT, "highscores.db")) as db:
                cur = db.cursor()
                cur.execute("INSERT INTO highscores (username, score, streak, time) VALUES (?,?,?,?)", (name, score, streak, time))
                db.commit()

            return "200"

        except sqlite3.Error as e:
            return e

    else:
        with sqlite3.connect(path.join(ROOT, "highscores.db")) as db:
            cur = db.cursor()
            highscores = cur.execute("SELECT username, score, streak, time FROM highscores ORDER BY score DESC LIMIT 20")

        return render_template("index.html", highscores=highscores)

