import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar, Clock, FileText, CheckCircle, Upload, Filter, SortAsc } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "../contexts/AuthContext";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  timeLeft: string;
  marks: number;
  type: string;
  priority: "high" | "medium" | "low";
  description: string;
  status: "pending" | "submitted" | "graded";
  submittedDate?: string;
  obtainedMarks?: number;
  feedback?: string;
  grade?: string;
}

export function Assignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterType, setFilterType] = useState("all");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  // Fetch assignments from backend
  useEffect(() => {
    if (user && token) {
      fetchAssignments();
    }
  }, [user, token]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/assignments/my-assignments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAssignments(data.assignments);
      } else {
        toast.error(data.message || "Failed to load assignments");
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status !== "pending");

  const filteredPending = pendingAssignments
    .filter((a) => filterType === "all" || a.type === filterType)
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      toast.error("Please enter your submission");
      return;
    }

    try {
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment?.id,
          submissionText: submissionText,
          submittedAt: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Assignment submitted!", {
          description: `Your ${selectedAssignment?.title} has been submitted successfully.`,
        });
        setSelectedAssignment(null);
        setSubmissionText("");
        // Refresh assignments list
        fetchAssignments();
      } else {
        toast.error(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  // No assignments state
  if (assignments.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Assignments</h1>
          <p className="text-muted-foreground">Manage your coursework and submissions</p>
        </motion.div>

        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            No assignments available yet
          </div>
          <p className="text-muted-foreground">
            Your trainer will assign coursework soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Assignments</h1>
        <p className="text-muted-foreground">Manage your coursework and submissions</p>
      </motion.div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {/* Filters and Sort */}
          {pendingAssignments.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {filteredPending.length > 0 ? (
              filteredPending.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                >
                  <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3>{assignment.title}</h3>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <Badge
                              variant={assignment.priority === "high" ? "destructive" : "secondary"}
                            >
                              {assignment.priority}
                            </Badge>
                          </motion.div>
                          <Badge variant="outline">{assignment.type}</Badge>
                        </div>
                        <p className="text-muted-foreground">{assignment.course}</p>

                        <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <motion.div
                            className="flex items-center gap-2"
                            animate={{
                              color: assignment.priority === "high" ? "#dc2626" : "inherit",
                            }}
                          >
                            <Clock className="h-4 w-4" />
                            <span>{assignment.timeLeft}</span>
                          </motion.div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{assignment.marks} marks</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          View Details
                        </Button>
                        <Button onClick={() => setSelectedAssignment(assignment)}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending assignments</p>
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedAssignments.length > 0 ? (
            completedAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3>{assignment.title}</h3>
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring" }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </motion.div>
                        {assignment.grade && (
                          <Badge variant="outline">{assignment.grade}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{assignment.course}</p>

                      <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Submitted: {assignment.submittedDate ? 
                              new Date(assignment.submittedDate).toLocaleDateString() : 
                              'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <motion.span
                            className="text-green-600"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {assignment.obtainedMarks || 0}/{assignment.marks} marks
                          </motion.span>
                        </div>
                      </div>

                      {assignment.feedback && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <p className="text-muted-foreground">Feedback:</p>
                          <p>{assignment.feedback}</p>
                        </motion.div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => toast.info("Opening your submission...")}
                    >
                      View Submission
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No completed assignments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Submission Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignment ? `Submit Assignment - ${selectedAssignment.title}` : 'Submit Assignment'}
            </DialogTitle>
            <DialogDescription>
              {selectedAssignment?.course}
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-2">Assignment Details:</p>
                <p>{selectedAssignment.description}</p>
                <div className="flex gap-4 mt-3 text-muted-foreground">
                  <span>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedAssignment.marks} marks</span>
                  <span>•</span>
                  <span>{selectedAssignment.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Submission</Label>
                <Textarea
                  placeholder="Enter your answer or paste your submission link..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Click to upload files</p>
                <p className="text-muted-foreground">PDF, DOC, ZIP (Max 10MB)</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}