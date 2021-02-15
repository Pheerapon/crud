
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Crud.module.css'

const index = ({ avatar_url, login }) => {
    const [dogs, setDogs] = useState([
        // { id: 1, name: 'A', age: '3' },
        // { id: 2, name: 'B', age: '2' }
    ])

    const [age, setAge] = useState('')

    const [name, setName] = useState('')

    const [idEdit, setIdEdit] = useState(0)

    useEffect(async () => {
        let ts = await getTasks();
        console.log(ts)
        setDogs(ts)
    }, [])



    const renderDogs = () => {
        if (dogs !== null)
            return dogs.map((dog, index) => (
                <li key={index} className={styles.listItem}>
                    {index + 1}) Dog Name: &nbsp;
                    {(idEdit !== dog.id) ?
                        dog.name :
                        (<input
                            className={styles.text}
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => (setName(e.target.value))}
                        />)
                    }
                    <br></br> &nbsp; &nbsp; Dog Age:  &nbsp;
                    {(idEdit !== dog.id) ?
                        dog.age :
                        (<input
                            className={styles.text}
                            type="text"
                            name="age"
                            value={age}
                            onChange={(e) => (setAge(e.target.value))}
                        />)
                    }
                    <div className={styles.buttonContainer}>
                        <button
                            className={`${styles.button} ${styles.btnEdit}`}
                            onClick={() => editDog(dog.id)}>
                            Update
                        </button>
                        <button
                            className={`${styles.button} ${styles.btnDelete}`}
                            onClick={() => deleteDog(dog.id)}>
                            Delete
                        </button>
                    </div>
                </li>))
    }
    const editDog = (id) => {
        setIdEdit(id)
        let t = dogs.find((dog) => +dog.id === +id)
        setName(t.name)
        setAge(t.age)
        if (+idEdit === +id) { //Press Edit again
            let newDogs = dogs.map((dog, index) => {
                if (+dog.id === +id) {
                    dogs[index].name = name
                    dogs[index].age = age
                }
                return dog
            })
            setDogs(newDogs)
            setIdEdit(0)
        }
    }

    const deleteDogs = (id) => {
        console.log('delete id: ', id)
        let newDogs = dogs.filter((dog) => dog.id !== +id)
        setDogs(newDogs)
    }

    const addDog = () => {
        console.log("Add!")
        const id = dogs[dogs.length - 1].id + 1;
        if (dogs.length < 10 && name !== '') {
            setDogs([...dogs, { id, name, age }])

        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}><img src={avatar_url} width="80" />CRUD Dogs </h1>

            <br></br>

            <div className="addContainer">
                <input
                    className={styles.text}
                    placeholder="Enter dog name"
                    type="text"
                    name="addName"
                    onChange={(e) => (setName(e.target.value))} />
                <br></br>
                <input
                    className={styles.text}
                    placeholder="Enter dog age"
                    type="text"
                    name="addAge"
                    onChange={(e) => (setAge(e.target.value))} /><br></br>

                <div className={styles.buttonContainer}><button
                    className={`${styles.button} ${styles.btnAdd}`}
                    onClick={() => addDog(name)}>Create</button>
                </div>


            </div>
            <ul className={styles.list}>
                {renderDogs()}
            </ul>
        </div>
    )
}

const getTasks = async () => {
    const res = await fetch('http://localhost:8000/')
    const json = await res.json()
    console.log(json)
    return json;
}


index.getInitialProps = async (ctx) => {
    const res = await fetch('https://api.github.com/users/Pheerapon')
    const json = await res.json()
    return { login: json.login, avatar_url: json.avatar_url }
}

export default index