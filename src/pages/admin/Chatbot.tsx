
import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useChatbot, ChatbotQuestion } from '../../contexts/ChatbotContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Chatbot = () => {
  const { predefinedQuestions, addPredefinedQuestion, updatePredefinedQuestion, deletePredefinedQuestion } = useChatbot();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ChatbotQuestion | null>(null);
  const [formData, setFormData] = useState<Omit<ChatbotQuestion, 'id'>>({
    question: '',
    answer: '',
  });
  
  // Filter questions based on search
  const filteredQuestions = predefinedQuestions.filter(q => 
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.answer.toLowerCase().includes(search.toLowerCase())
  );
  
  const openNewQuestionDialog = () => {
    setIsEditMode(false);
    setSelectedQuestion(null);
    setFormData({
      question: '',
      answer: '',
    });
    setIsDialogOpen(true);
  };
  
  const openEditQuestionDialog = (question: ChatbotQuestion) => {
    setIsEditMode(true);
    setSelectedQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
    });
    setIsDialogOpen(true);
  };
  
  const handleSaveQuestion = () => {
    try {
      if (isEditMode && selectedQuestion) {
        updatePredefinedQuestion(
          selectedQuestion.id,
          formData.question,
          formData.answer
        );
        
        toast({
          title: 'Question Updated',
          description: 'The chatbot question has been updated successfully',
        });
      } else {
        const newQuestion: ChatbotQuestion = {
          id: `q-${Date.now()}`,
          ...formData,
        };
        
        addPredefinedQuestion(newQuestion);
        
        toast({
          title: 'Question Added',
          description: 'The new question has been added to the chatbot',
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the question. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deletePredefinedQuestion(id);
      
      toast({
        title: 'Question Deleted',
        description: 'The question has been removed from the chatbot',
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Chatbot Management</h1>
            <p className="text-gray-500">Manage the questions and answers for your AI chatbot</p>
          </div>
          <Button
            onClick={openNewQuestionDialog}
            className="bg-garage-blue hover:bg-garage-darkBlue"
          >
            Add New Question
          </Button>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search questions and answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        
        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Predefined Questions ({filteredQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{item.question}</h3>
                        <p className="text-gray-600 mt-2">{item.answer}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditQuestionDialog(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:border-red-200"
                          onClick={() => handleDeleteQuestion(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No questions match your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Question Dialog (Add/Edit) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Question' : 'Add New Question'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Update the question and answer for your chatbot.'
                  : 'Add a new question and answer for your chatbot to respond to.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., What services do you offer?"
                  required
                />
              </div>
              
              {/* Answer */}
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a detailed answer..."
                  className="resize-none min-h-32"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveQuestion}
                disabled={!formData.question || !formData.answer}
                className="bg-garage-blue hover:bg-garage-darkBlue"
              >
                {isEditMode ? 'Update Question' : 'Add Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Chatbot;
