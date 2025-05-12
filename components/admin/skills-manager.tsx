"use client"

import type React from "react"

import { useState } from "react"
import type { Skill } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash } from "lucide-react"
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

interface SkillsManagerProps {
  skills: Skill[]
}

export default function SkillsManager({ skills }: SkillsManagerProps) {
  const [skillsByCategory, setSkillsByCategory] = useState(() => {
    const grouped: Record<string, Skill[]> = {}
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })
    return grouped
  })

  const [newSkill, setNewSkill] = useState<Omit<Skill, "id" | "created_at" | "updated_at">>({
    name: "",
    category: "",
    proficiency: 75,
  })

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSkill((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingSkill) return
    const { name, value } = e.target
    setEditingSkill((prev) => ({ ...prev!, [name]: value }))
  }

  const handleAddSkill = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("skills")
        .insert({
          name: newSkill.name,
          category: newSkill.category,
          proficiency: newSkill.proficiency,
        })
        .select()

      if (error) throw error

      toast({
        title: "Skill added",
        description: `${newSkill.name} has been added successfully`,
      })

      // Reset form
      setNewSkill({
        name: "",
        category: "",
        proficiency: 75,
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Failed to add skill",
        description: "An error occurred while adding the skill",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSkill = async () => {
    if (!editingSkill) return
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("skills")
        .update({
          name: editingSkill.name,
          category: editingSkill.category,
          proficiency: editingSkill.proficiency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingSkill.id)

      if (error) throw error

      toast({
        title: "Skill updated",
        description: `${editingSkill.name} has been updated successfully`,
      })

      setEditingSkill(null)
      router.refresh()
    } catch (error) {
      console.error("Error updating skill:", error)
      toast({
        title: "Update failed",
        description: "Failed to update skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("skills").delete().eq("id", skillId)

      if (error) throw error

      toast({
        title: "Skill deleted",
        description: "The skill has been deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>Add a new skill to showcase on your portfolio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newSkill.name}
                  onChange={handleNewSkillChange}
                  placeholder="e.g. React"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={newSkill.category}
                  onChange={handleNewSkillChange}
                  placeholder="e.g. Framework"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proficiency">Proficiency: {newSkill.proficiency}%</Label>
                <Slider
                  id="proficiency"
                  min={1}
                  max={100}
                  step={1}
                  value={[newSkill.proficiency]}
                  onValueChange={(value) => setNewSkill((prev) => ({ ...prev, proficiency: value[0] }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSkill} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Skill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <Card key={category} className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>Manage your {category.toLowerCase()} skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{skill.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-full max-w-xs skill-bar">
                        <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{skill.proficiency}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setEditingSkill(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Skill</DialogTitle>
                          <DialogDescription>Update the details for this skill</DialogDescription>
                        </DialogHeader>
                        {editingSkill && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Skill Name</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={editingSkill.name}
                                onChange={handleEditSkillChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Input
                                id="edit-category"
                                name="category"
                                value={editingSkill.category}
                                onChange={handleEditSkillChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-proficiency">Proficiency: {editingSkill.proficiency}%</Label>
                              <Slider
                                id="edit-proficiency"
                                min={1}
                                max={100}
                                step={1}
                                value={[editingSkill.proficiency]}
                                onValueChange={(value) =>
                                  setEditingSkill((prev) => ({ ...prev!, proficiency: value[0] }))
                                }
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateSkill} disabled={isLoading}>
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
                          <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this skill? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSkill(skill.id)}
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
      ))}
    </div>
  )
}
