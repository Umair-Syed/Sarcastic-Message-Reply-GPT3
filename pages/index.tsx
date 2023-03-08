import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/main-image.jpg'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'


export default function Home() {

  const [reply, setReply] = useState<string>('');
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const [replyError, setReplyError] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message')?.toString().trim();
    
    if(message){
      try{
        setReply("");
        setReplyError(false);
        setReplyLoading(true);
        
        const response = await fetch('/api/reply?message=' + encodeURIComponent(message));
        const body = await response.json();
        console.log("body", body);
        setReply(body.reply);
      }catch(error){
        console.error("error", error);
        setReplyError(true);
      }finally {
        setReplyLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Killer Reply - Sarcastic message reply</title>
        <meta name="description" content="Killer Reply - Sarcastic message reply" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Killer Reply</h1>
        <h2>Sarcastic message reply</h2>
        <div>Enter a message for which you want to get sarcastic reply.</div>
        <div className={styles.mainImageContainer}>
          <Image 
            src={mainImage} 
            alt='Deadpool'
            priority
            className={styles.mainImage}
            width={400} height={300}
          />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className='mb-3' controlId='message-input'>
            <Form.Label>Message (Max length: 500 characters)</Form.Label>
            <Form.Control 
            name="message"            
            placeholder="Enter message (e.g What's up man?)"
            maxLength={500} />
          </Form.Group>
          <Button type='submit' className='mb-3' disabled={replyLoading}>
            Get sarcastic reply
          </Button>
        </Form>
        { replyLoading && <Spinner animation='border'/> }
        { replyError && <div>Something went wrong. Please try again.</div> }
        { reply && <h5>{reply}</h5> }
      </main>
    </>
  )
}
