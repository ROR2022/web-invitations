import MusicPlayer from '@/components/example-quince/music-player'
import Hero from '@/components/example-quince/hero'
import Invitation from '@/components/example-quince/invitation'
import Countdown from '@/components/example-quince/countdown'
import EventDetails from '@/components/example-quince/event-details'
import Attendance from '@/components/example-quince/attendance'
import GiftOptions from '@/components/example-quince/gift-options'
import Gallery from '@/components/example-quince/gallery'
import ThankYou from '@/components/example-quince/thank-you'





const ExampleQuincePage = () => {
  return (
    <main className={`min-h-screen `}>
      <MusicPlayer />
      <Hero />
      <Invitation />
      <Countdown />
      <EventDetails />
      <Attendance />
      <GiftOptions />
      <Gallery />
      <ThankYou />
    </main>
  )
}

export default ExampleQuincePage