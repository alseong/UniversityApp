import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Feedback & Contact Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you! Whether you have feedback, questions,
              or need support, we're here to help make admitme better for
              everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  action="https://app.youform.com/forms/i14kuart"
                  method="POST"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-feedback">
                          General Feedback
                        </SelectItem>
                        <SelectItem value="bug-report">Bug Report</SelectItem>
                        <SelectItem value="feature-request">
                          Feature Request
                        </SelectItem>
                        <SelectItem value="data-question">
                          Data Question
                        </SelectItem>
                        <SelectItem value="account-support">
                          Account Support
                        </SelectItem>
                        <SelectItem value="partnership">
                          Partnership Inquiry
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your feedback, question, or how we can help..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Quick Links */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Email Us Directly</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      For immediate support or detailed inquiries
                    </p>
                    <a
                      href="mailto:minjun@ccinet.com"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      minjun@ccinet.com
                    </a>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">External Form</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Prefer our external contact form?
                    </p>
                    <a
                      href="https://app.youform.com/forms/i14kuart"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Open External Form
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Before reaching out, you might find your answer in our FAQ
                    section.
                  </p>
                  <a
                    href="/#faq"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View FAQ Section
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • <strong>General inquiries:</strong> Within 24-48 hours
                    </li>
                    <li>
                      • <strong>Bug reports:</strong> Within 24 hours
                    </li>
                    <li>
                      • <strong>Account support:</strong> Within 12-24 hours
                    </li>
                    <li>
                      • <strong>Urgent issues:</strong> Email us directly for
                      faster response
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">We Value Your Input</h3>
                <p className="text-gray-600 text-sm">
                  admitme is built for students, by students. Your feedback
                  helps us improve the platform and create better tools for
                  future applicants. Whether it's a suggestion for new features,
                  a report about data accuracy, or just general thoughts about
                  your experience, we want to hear from you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
