import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import TeacherRectangle from '../../../components/teacherRectangle/TeacherRectangle'
import Link from 'next/link'
/* icon imports*/
import { FaUserCircle } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsArrowLeftCircle } from 'react-icons/bs';
import ArrowGoBack from '../../../components/ArrowGoBack/ArrowGoBack'

export default function GroupDetail() {
    const router = useRouter()
    const groupId = router.query.groupId
    const [teachers, setTeachers] = useState([])
    const [students, setStudents] = useState([])
    const [route, setRoute] = useState("")
    const [userRole, setUserRole] = useState("")

    useEffect(() => {

        const token = localStorage.getItem('token')
        fetch(`https://api.toknow.online/group/${groupId}`, {
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then(data => {
                if (data.data) {
                    setTeachers(data.data.groupById.teachers)
                    setStudents(data.data.groupById.students)

                }

            })
    }, [router.query])
    const handleEyeClick = (groupId, userId, strRutaExtra) => {
        router.push(`/grouplist/${groupId}/${strRutaExtra}${userId}`)
        console.log('funciona el eyeClic')
    };

    const handleTrashClick = (strRoute, userId) => {
        const token = localStorage.getItem("token");
        fetch(`https://api.toknow.online/${strRoute}/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok === true) {
                    window.location.reload();
                }
            })
    };
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token){
            router.replace("/")
            return
        } else {
        const userData = JSON.parse(atob(token.split(".")[1]));
        const userRole = userData.role;
        setUserRole(userData.role)
        //condición para rutas de componente ArrowGoBack
        let route = ("")
        if (userRole == "admin") {
            route = "/grouplist"
        } else {
            if (userRole == "parent") {
                route = "/parent/yourgroups"
            } else {
                route = "/teacher/yourgroups"
            }
        }
        setRoute(route)
    }
    }, [])

    return (
        <>
            <Layout>
                <div>
                    <ArrowGoBack
                    route={`${route}`}/>
                    
                    <div className='d-flex flex-column flex-lg-row justify-content-lg-around'>
                        <div className='d-flex flex-column col-lg-5 align-items-center'>
                            <div className='d-flex col-lg-8' >
                                <div className='d-flex col-lg-6 justify-content-between'>
                                    <div className='d-flex col-8 col-lg-9 justify-content-around'>
                                        <h4><FaUserCircle className='user-circle user-circle__teacher' /></h4>
                                        <h4>Profesores</h4>
                                    </div>
                                    {(userRole == "admin") && (teachers.length < 3) &&
                                        <Link href="/grouplist/[groupId]/addteacher"
                                            as={`/grouplist/${groupId}/addteacher`} style={{ textDecoration: 'none' }}><h4><AiFillPlusCircle /></h4>
                                        </Link>
                                    }
                                </div>
                            </div>
                            {(Array.isArray(teachers) && teachers.length > 0) ?
                                teachers.map((teacher) => {
                                    return (
                                        // <Link href="/grouplist/[groupId]/teacher/[teacherId]"
                                        //     as={`/grouplist/${groupId}/teacher/${teacher._id}`} key={teacher._id} style={{ textDecoration: 'none' }} >
                                        <TeacherRectangle
                                            key={teacher._id}
                                            name={teacher.name}
                                            lastNameA={teacher.lastNameA}
                                            lastNameB={teacher.lastNameB}
                                            tipoProfesor={teacher.tipoProfesor}
                                            onEyeClick={() => handleEyeClick(groupId, teacher._id, "teacher/")}
                                            onTrashClick={() => handleTrashClick("teacher", teacher._id)}
                                        />
                                        // </Link>
                                    )
                                }) : <p>No hay profesores asignados</p>
                            }
                        </div>
                        <div className='d-flex flex-column col-lg-5 align-items-center'>
                            <div className='d-flex col-lg-8' >
                                <div className='d-flex col-lg-6 justify-content-between'>
                                    <div className='d-flex col-8 col-lg-9 justify-content-around'>
                                        <h4><FaUserCircle className='user-circle user-circle__student' /></h4>
                                        <h4>Alumnos</h4>
                                    </div>
                                    {(userRole == "admin") ?
                                        <Link href="/grouplist/[groupId]/addstudent"
                                            as={`/grouplist/${groupId}/addstudent`} style={{ textDecoration: 'none' }}><h4><AiFillPlusCircle /></h4>
                                        </Link> : <p></p>
                                    }
                                </div>
                            </div>
                            {(Array.isArray(students) && students.length > 0) ?
                                students.map(student => {
                                    return (
                                        <TeacherRectangle
                                            key={student._id}
                                            name={student.name}
                                            lastNameA={student.lastNameA}
                                            lastNameB={student.lastNameB}
                                            tipoProfesor={student.tipoProfesor}
                                            onEyeClick={() => handleEyeClick(groupId, student._id, "")}
                                            onTrashClick={() => handleTrashClick("student", student._id)}
                                        />
                                    )
                                }) : <p>No hay alumnos asignados</p>
                            }
                        </div>
                    </div>
                </div>

                {/* <ul>
                    <li>materia 1</li>
                    <li>materia 2</li>
                    <li>materia 3</li>
                    <li>materia 4</li>
                    <li>materia 5</li>
                </ul> */}

            </Layout>
        </>
    )
}
