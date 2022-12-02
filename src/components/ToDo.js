import React, { useEffect, useState } from 'react';
import "./ToDo.css";

const ToDo = () => {
    const [todos, setToDos] = useState([])

    const handlerSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const todo = { id: Date.now(), title: data.get("title") };
        setToDos([
            todo,
            ...todos
        ])
        let list = localStorage.getItem('listA')
        if (list) {
            list = JSON.parse(list);
        } else {
            list = [];
        }
        list.push(todo);
        localStorage.setItem('listA', JSON.stringify(list))
        console.log("local = ", localStorage.getItem('listA'));
    }

    const deleteTodo = (id) => {
        setToDos(todos.filter((t) => t.id !== id))
    }

    const completed = (id) => {
        let toDos2 = []
        todos.forEach((x) => {
            if (x.id === id) {
                x.completed = !x.completed
            }
            toDos2.push(x)
        })
        setToDos(toDos2)

        let list = localStorage.getItem("listA")
        if (list) {
            list = JSON.parse(list)

            let newList = list.map((it) => {
                if (it.id === id) {
                    it.completed = (!it.completed)
                }
                return it
            })
            localStorage.setItem('ListA', JSON.stringify(newList))
        }

    }

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos/')
            .then((data) => data.json())
            .then((data) => {
                let finalList = [];

                let list = localStorage.getItem("listA")
                if (list) {
                    finalList = [...JSON.parse(list)]
                }
                if (data) {
                    finalList = [...finalList, ...data]
                }

                setToDos(finalList)
            })
    }, [])

    return (
        <div className="toDoContainer">
            <form className='myForm' onSubmit={handlerSubmit}>
                <div className='Form-Div'>
                    <input id="name" name="title" type={"text"} />
                    <button>Add</button>
                </div>
            </form>
            <ul className='Ul'>
                {todos.map((list) => (
                    <div className='Li-Container' key={list.id}>
                        <li className='Li-item'>
                            {list.title}
                        </li>
                        <div className='btn-Container'>
                            <button onClick={e => deleteTodo(list.id)}>Delete</button>
                            <button style={{ background: list.completed ? "green" : "red" }} onClick={e => completed(list.id)}>Completed</button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default ToDo;