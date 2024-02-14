import React from 'react'
import { useParams } from "react-router-dom";

function View() {
    const { id } = useParams();
  return (
    <div>{id}</div>
  )
}

export default View