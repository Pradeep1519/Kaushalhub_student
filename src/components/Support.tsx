import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { HelpCircle, MessageSquare, Book, Video, Mail, Phone, Send, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

export function Support() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const tickets = [
    {
      id: "#TKT-001",
      subject: "Cannot access course materials",
      status: "open",
      priority: "high",
      date: "Oct 9, 2025",
      lastUpdate: "2 hours ago",
      category: "Technical",
    },
    {
      id: "#TKT-002",
      subject: "Payment confirmation not received",
      status: "in-progress",
      priority: "medium",
      date: "Oct 7, 2025",
      lastUpdate: "1 day ago",
      category: "Billing",
    },
    {
      id: "#TKT-003",
      subject: "Certificate download issue",
      status: "resolved",
      priority: "low",
      date: "Oct 5, 2025",
      lastUpdate: "3 days ago",
      category: "Certificates",
    },
  ];

  const faqs = [
    {
      question: "How do I access my course materials?",
      answer: "Navigate to 'My Courses' from the sidebar, select your course, and all materials including videos, PDFs, and assignments will be available in the Resources section.",
    },
    {
      question: "How can I track my attendance?",
      answer: "Go to the 'Attendance' section from the sidebar. You'll see your overall attendance percentage and course-wise breakdown with detailed records.",
    },
    {
      question: "What is the minimum attendance requirement?",
      answer: "You must maintain at least 75% attendance in each course to be eligible for certification and final exams.",
    },
    {
      question: "How do I submit assignments?",
      answer: "Go to 'Assignments', click on the assignment you want to submit, and use the 'Submit' button to upload your work.",
    },
    {
      question: "When will I receive my certificate?",
      answer: "Certificates are issued within 7 days of course completion, provided you've met all requirements including attendance and assessments.",
    },
    {
      question: "How do I join live classes?",
      answer: "Navigate to 'Live Classes', find the ongoing class, and click 'Join Live Class'. Make sure you have a stable internet connection.",
    },
    {
      question: "Can I download course videos?",
      answer: "Selected course videos are available for download. Look for the download icon on the video player or in the Resources section.",
    },
    {
      question: "How do I contact my instructor?",
      answer: "Use the 'Messages' feature to directly chat with your instructors. You can also email them through the course page.",
    },
  ];

  const quickLinks = [
    {
      title: "User Guide",
      description: "Comprehensive guide to using the portal",
      icon: Book,
      color: "blue",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      icon: Video,
      color: "purple",
    },
    {
      title: "Email Support",
      description: "support@kaushalhub.com",
      icon: Mail,
      color: "green",
    },
    {
      title: "Phone Support",
      description: "+91 1800-123-4567 (Mon-Fri, 9AM-6PM)",
      icon: Phone,
      color: "orange",
    },
  ];

  const handleSubmitTicket = () => {
    if (ticketSubject && ticketMessage) {
      toast.success("Support ticket submitted successfully!");
      setTicketSubject("");
      setTicketMessage("");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "in-progress":
        return <Badge className="bg-orange-500">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "closed":
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with your courses and technical issues
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-lg bg-${link.color}-100 dark:bg-${link.color}-950`}>
                    <Icon className={`h-6 w-6 text-${link.color}-600`} />
                  </div>
                  <div>
                    <h4>{link.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <MessageSquare className="h-4 w-4 mr-2" />
            My Tickets ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            <Send className="h-4 w-4 mr-2" />
            New Ticket
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </TabsContent>

        {/* My Tickets */}
        <TabsContent value="tickets" className="mt-6 space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3>{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                        <Badge variant="outline">{ticket.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Ticket {ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>Created {ticket.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {ticket.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* New Ticket */}
        <TabsContent value="new" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-6">Create Support Ticket</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payment</SelectItem>
                      <SelectItem value="course">Course Content</SelectItem>
                      <SelectItem value="certificate">Certificates</SelectItem>
                      <SelectItem value="account">Account & Profile</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Brief description of your issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <Input type="file" multiple />
                <p className="text-xs text-muted-foreground">
                  You can attach screenshots or documents to help us understand your issue better
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmitTicket}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
