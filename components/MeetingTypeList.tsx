'use client'

import { useRouter } from "next/navigation"
import { useState } from "react";

import HomeCard from "./HomeCard"
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";

const initialValues = {
  dateTime: new Date(),
  des: '',
  link: '',
}

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
  'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState(initialValues);
  const [callDetails, setCallDetails] = useState<Call>();const { toast } = useToast();

  console.log(meetingState)

  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      if(!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if(!call) throw new Error('Failed to create meeting');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const des = values.des || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            des
          }
        }
      })

      setCallDetails(call);

      if(!values.des) {
        router.push(`/meeting/${call.id}`)
      }

      toast({ title: 'Meeting Created' })
    } catch (error) {
      console.log(error);
      toast({ title: 'Failed to create meeting' })
   }
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        des="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        des="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        des="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        des="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList