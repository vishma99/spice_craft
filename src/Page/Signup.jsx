import React, { useEffect, useState } from 'react'

export default function Signup() {

    const [data, setData] = useState([])
    useEffect(()=> {
        fetch('http://localhost:8084/registercustomer')
        .then(res=> res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));
    },[])
  return (
    <div style={{padding: "50px"}}>
      <table>
        <thead>
            <th>id</th>
            <th>name</th>
            <th>email</th>
            <th>contact</th>
            <th>address</th>
            <th>username</th>
            <th>password</th>
        </thead>
        <tbody>
            {data.map((d,i)=>(
                <tr key={i}>
                    <td>{d.customerId}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.contactNumber}</td>
                    <td>{d.address}</td>
                    <td>{d.username}</td>
                    <td>{d.password}</td>

                </tr>

            ))}
        </tbody>
      </table>
    </div>
  )
}
