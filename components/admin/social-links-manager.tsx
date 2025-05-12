"use client"

import type React from "react"

import { useState } from "react"
import type { SocialLink } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash, Facebook, Github, Linkedin, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SocialLinksManagerProps {
  socialLinks: SocialLink[]
}

export default function SocialLinksManager({ socialLinks }: SocialLinksManagerProps) {
  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, "id" | "created_at" | "updated_at">>({
    platform: "",
    url: "",
  })

  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  const handleNewSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSocialLink((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingSocialLink) return
    const { name, value } = e.target
    setEditingSocialLink((prev) => ({ ...prev!, [name]: value }))
  }

  const handleAddSocialLink = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("social_links")
        .insert({
          platform: newSocialLink.platform,
          url: newSocialLink.url,
        })
        .select()

      if (error) throw error

      toast({
        title: "Social link added",
        description: `${newSocialLink.platform} has been added successfully`,
      })

      // Reset form
      setNewSocialLink({
        platform: "",
        url: "",
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding social link:", error)
      toast({
        title: "Failed to add social link",
        description: "An error occurred while adding the social link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSocialLink = async () => {
    if (!editingSocialLink) return
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: editingSocialLink.platform,
          url: editingSocialLink.url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingSocialLink.id)

      if (error) throw error

      toast({
        title: "Social link updated",
        description: `${editingSocialLink.platform} has been updated successfully`,
      })

      setEditingSocialLink(null)
      router.refresh()
    } catch (error) {
      console.error("Error updating social link:", error)
      toast({
        title: "Update failed",
        description: "Failed to update social link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSocialLink = async (socialLinkId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("social_links").delete().eq("id", socialLinkId)

      if (error) throw error

      toast({
        title: "Social link deleted",
        description: "The social link has been deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting social link:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete social link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Links Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Social Link</DialogTitle>
              <DialogDescription>Add a new social media link to your portfolio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  name="platform"
                  value={newSocialLink.platform}
                  onChange={handleNewSocialLinkChange}
                  placeholder="e.g. Facebook, Twitter, LinkedIn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={newSocialLink.url}
                  onChange={handleNewSocialLinkChange}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSocialLink} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Social Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Manage your social media presence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialLinks.map((socialLink) => (
              <div
                key={socialLink.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm">
                    {getSocialIcon(socialLink.platform)}
                  </div>
                  <div>
                    <h4 className="font-medium">{socialLink.platform}</h4>
                    <a
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {socialLink.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingSocialLink(socialLink)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Social Link</DialogTitle>
                        <DialogDescription>Update the details for this social media link</DialogDescription>
                      </DialogHeader>
                      {editingSocialLink && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-platform">Platform</Label>
                            <Input
                              id="edit-platform"
                              name="platform"
                              value={editingSocialLink.platform}
                              onChange={handleEditSocialLinkChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-url">URL</Label>
                            <Input
                              id="edit-url"
                              name="url"
                              value={editingSocialLink.url}
                              onChange={handleEditSocialLinkChange}
                              required
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={handleUpdateSocialLink} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this social link? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSocialLink(socialLink.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
