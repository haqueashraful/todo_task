import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IncompleteBoard from './components/IncompleteBoard'
import TodoBoard from './components/TodoBoard'
import DoingBoard from './components/DoingBoard'
import Completed from './components/Completed'
import OverDue from './components/OverDue'
import UnderReviewBoard from './components/UnderReviewBoard'

function App() {
  const [incompleteData, setIncompleteData] = useState([]);
  const [todoData, setTodoData] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [doingData, setDoingData] = useState([]);
  const [underReviewData, setUnderReviewData] = useState([]);
  const [overDueData, setOverDueData] = useState([]);
  useEffect(() => {

      fetch('data.json')
      .then(response => response.json())
      .then(data => {
          const incompleteData = data.filter(card => card.status === 'Incomplete');
          const completeData = data.filter(card => card.status === 'Completed');
          const doingData = data.filter(card => card.status === 'In Progress');
          const underReviewData = data.filter(card => card.status === 'Under Review');
          const overDueData = data.filter(card => card.status === 'Overdue');
          const todoData = data.filter(card => card.status === 'To Do');

          if (incompleteData) {
              setIncompleteData(incompleteData);
          }

          if (completeData) {
              setCompleteData(completeData);
          }

          if (doingData) {
              setDoingData(doingData);
          }

          if (underReviewData) {
              setUnderReviewData(underReviewData);
          }

          if (overDueData) {
              setOverDueData(overDueData);
          }

          if (todoData) {
              setTodoData(todoData);
          }

      })
  }, []);

  return (
    <>
      <div className='flex gap-4 px-8 pt-8 h-screen overflow-x-auto overflow-y-hidden'>
        <IncompleteBoard data={incompleteData}/>
        <TodoBoard data={todoData}/>
        <DoingBoard data={doingData}/>
        <UnderReviewBoard data={underReviewData}/>
        <Completed data={completeData}/>
        <OverDue data={overDueData}/>
      </div>
    </>
  )
}

export default App
