import {InferGetStaticPropsType} from "next";
import {useEffect, useState} from "react";


export default function TaskPage(
  props: InferGetStaticPropsType<typeof getServerSideProps>
) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    })
  }, [])

  const reloadTasks = async () => {
    const tasks = await getTasks();
    setTasks(tasks);
  }

  const getTasks = async () => {
    const res = await fetch('/api/task');
    const json = await res.json();
    console.log(json);
    return json;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: e.currentTarget.title.value,
      })
    });
    const json = await res.json();
    e.currentTarget.rese
    console.log(json);
    await reloadTasks();
  }
  return (
    <div>
      <form onSubmit={onSubmit}>

        <h1
          className="text-4xl font-bold text-center text-gray-800"
        >Task</h1>
        <ul
          className="list-none flex flex-col space-x-2"
        >
          {tasks.map((task) => (
            <li
              className="flex-1 bg-gray-200
              hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              key={task.id}>
              <input type="checkbox"
                     value={task.done}
                     onClick={reloadTasks}
                     className="form-checkbox h-5 w-5 text-gray-600"/>

              {task.title}
            </li>
          ))}
        </ul>

        <p>
          <input
            className="shadow appearance-none border border-gray-500
             rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="title"/>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            mt-2 mb-2 ml-2"
          >Create Task
          </button>
        </p>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      tasks: []
    }
  }
}
