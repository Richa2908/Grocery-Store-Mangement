from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Enable CORS for communication between frontend and backend

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="RICHA@mysql",
    database="grocery_db"
)

@app.route('/items', methods=['GET'])
def get_items():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM grocery_items")
    items = cursor.fetchall()
    return jsonify(items)

@app.route('/item', methods=['POST'])
def add_item():
    data = request.json
    cursor = db.cursor()
    sql = "INSERT INTO grocery_items (name, quantity, price) VALUES (%s, %s, %s)"
    values = (data['name'], data['quantity'], data['price'])
    cursor.execute(sql, values)
    db.commit()
    return jsonify({"message": "Item added successfully!"})

@app.route('/item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    cursor = db.cursor()
    sql = "UPDATE grocery_items SET name=%s, quantity=%s, price=%s WHERE id=%s"
    values = (data['name'], data['quantity'], data['price'], item_id)
    cursor.execute(sql, values)
    db.commit()
    return jsonify({"message": "Item updated successfully!"})

@app.route('/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    cursor = db.cursor()
    sql = "DELETE FROM grocery_items WHERE id=%s"
    cursor.execute(sql, (item_id,))
    db.commit()
    return jsonify({"message": "Item deleted successfully!"})

if __name__ == '__main__':
    app.run(debug=True)

