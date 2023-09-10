import {NextApiRequest, NextApiResponse} from "next";
import {randomUUID} from "crypto";
import {getFirestore} from "firebase-admin/firestore";
import firebaseAdmin from "../../firebase-admin";

type Task = {
  id: string;
  title: string;
  createdAt: Date;
  done: boolean;
}

type CreateTaskRequest = Omit<Task, 'id' | 'createdAt' | 'done'>

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401)
      .json({message: 'Invalid token'});
  }

  const authRes = await firebaseAdmin.auth().verifyIdToken(token);
  const {email} = authRes;

  if (req.method === 'POST') {
    const task: CreateTaskRequest = req.body;
    await create(task, email);
    res.status(201)
      .json({});
  } else if (req.method === 'GET') {
    const tasks = await get(email);
    res.status(200)
      .json(tasks);
  }
}

async function get(email: string) {
  const db = getFirestore(firebaseAdmin);
  const tasks = [];
  (await db.collection('users')
    .doc(email)
    .collection('tasks')
    .get())
    .forEach((doc) => {
      tasks.push(doc.data());
    })

  // get tasks from firestore
  // const tasks = await getDoc(doc(db, 'tasks', email));
  // console.log(tasks);
  // if (!doc.exists) {
  //   return [];
  // }
  // return [doc.data()];
  return tasks
}

async function create(task: CreateTaskRequest, email: string) {
  // create random UUID
  const id = randomUUID();
  const createdAt = new Date();
  const done = false;
  const newTask: Task = {
    id,
    createdAt,
    done,
    ...task
  }

  const firebaseApp = firebaseAdmin;
  const db = getFirestore(firebaseApp);
  // add new task to firestore
  db
    .collection('users')
    .doc(email)
    .collection('tasks')
    .doc(newTask.id)
    .create(newTask)
    .then(() => {
      console.log("Document successfully written!");
    });
}

export default handler;
