"use client";

import {
  Course,
  MuxData,
  Progress,
  Purchase,
  Resource,
  Section,
} from "@/lib/types";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { File, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReadText from "@/components/custom/ReadText";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";

interface SectionsDetailsProps {
  course: Course & { sections: Section[] };
  section: Section;
  purchase: Purchase | null;
  muxData: MuxData | null;
  resources: Resource[] | [];
  progress: Progress | null;
}

const SectionsDetails = ({
  course,
  section,
  purchase,
  muxData,
  resources,
  progress,
}: SectionsDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLocked = !purchase && !section.isFree;

  const buyCourse = async () => {
    try {
      setIsLoading(true);
      
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        const response = await axios.post(`/api/courses/${course.id}/checkout`);
        
        const {
          orderId,
          amount,
          keyId,
          customerId,
          customerEmail,
          customerName,
          courseId
        } = response.data;

        // Initialize Razorpay checkout
        const razorpay = new (window as any).Razorpay({
          key: keyId,
          order_id: orderId,
          amount: amount,
          currency: "INR",
          name: "Academy",
          description: `Purchase of ${course.title}`,
          customer_notification: 1,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: "", // User can fill this in checkout
          },
          handler: function (response: any) {
            // Payment successful, user will be redirected after webhook processes
            toast.success("Payment successful! Course access will be granted shortly.");
            setTimeout(() => {
              window.location.href = `/courses/${courseId}/overview?success=true`;
            }, 1500);
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
              toast.error("Payment cancelled");
            }
          }
        });

        razorpay.open();
      };

      script.onerror = () => {
        toast.error("Failed to load Razorpay");
        setIsLoading(false);
      };
    } catch (err) {
      console.log("Failed to checkout course", err);
      toast.error("Something went wrong!");
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold max-md:mb-4">{section.title}</h1>

        <div className="flex gap-4">
          <SectionMenu course={course} />
          {!purchase ? (
            <Button onClick={buyCourse}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>Buy this course</p>
              )}
            </Button>
          ) : (
            <ProgressButton
              courseId={course.id}
              sectionId={section.id}
              isCompleted={!!progress?.isCompleted}
            /> 
          )}
        </div>
      </div>

      <ReadText value={section.description!} />

      {isLocked ? (
        <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-bold">
            Video for this section is locked!. Please buy the course to access
          </p>
        </div>
      ) : (
        <MuxPlayer
          playbackId={muxData?.playbackId || ""}
          className="md:max-w-[600px]"
        />
      )}

      <div>
        <h2 className="text-xl font-bold mb-5">Resources</h2>
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={resource.fileUrl || ""}
            target="_blank"
            className="flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3"
          >
            <File className="h-4 w-4 mr-4" />
            {resource.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionsDetails;
