import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
//components
import Layout from '../../../../components/Layout'
import CardAnnouncement from '../../../../components/CardAnnouncement'
import ArrowGoBack from '../../../../components/ArrowGoBack/ArrowGoBack'
//toastify imports
import { ToastContainer } from 'react-toastify'
import useToastify from '../../../../components/useToastify'
//icons
import {BsPlusCircle } from 'react-icons/bs';


export default function GroupAnnouncements() {
  const router = useRouter()
  const groupId = router.query.groupId
  const [announceInfo, setAnnounceInfo] = useState([])
  const notifySuccess = useToastify("success", "¡Anuncio creado con éxito!")

  //check de item que viene desde newAnnouncement para notificación de anuncio creado
  useEffect(() => {
    const notifAnnounceCreation = localStorage.getItem('notifAnnounceCreation')
    if (notifAnnounceCreation === "true") {
      notifySuccess()
      localStorage.setItem('notifAnnounceCreation', 'false')
    }

  }, [])

  //petición a la api para setear anuncios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      //groupId anuncios
      fetch(`https://api.toknow.online/announcement`, {
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const allAnnouncements = data.data.announcement
          setAnnounceInfo(allAnnouncements.reverse())
        })
    }
  }, []);
  return (
    <Layout>
      <div>
        <ArrowGoBack
          btnTxtModal={<h4>Anuncios grupales</h4>}
          btnTxtModal2nd={<Link href={`/grouplist/${groupId}/newgroupannouncement`}>
            <button className='btn-form bg-success'>Anuncio <BsPlusCircle/></button>
          </Link>}
          route={`/grouplist/${groupId}`} 
        />
        {announceInfo.map(announce => (
          <Link href="/grouplist/[groupId]/groupannouncements/[groupAnnouncementId]"
            as={`/grouplist/${groupId}/groupannouncements/${announce._id}`} style={{ textDecoration: 'none' }} key={announce.key} >

            <CardAnnouncement
              coverimg={"/img/kid&parent.jpeg"}
              userName={announce.user.name}
              role={announce.user.role}
              date={"--fecha--"}
              announcementTitle={announce.announcementTitle} />
          </Link>
        ))}

      </div>
      <ToastContainer />
    </Layout>
  )
}
