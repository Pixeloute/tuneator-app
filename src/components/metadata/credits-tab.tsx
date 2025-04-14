
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, PlusCircle, Trash2, Wand2 } from "lucide-react";
import { MetadataFormState } from "./metadata-form";

interface CreditsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const CreditsTab = ({ formState, updateForm }: CreditsTabProps) => {
  // Add/remove handlers for composers
  const addComposer = () => {
    const newComposers = [
      ...formState.composers,
      { id: Date.now().toString(), name: "", role: "Songwriter", share: 0 }
    ];
    updateForm('composers', newComposers);
  };
  
  const removeComposer = (id: string) => {
    const newComposers = formState.composers.filter(c => c.id !== id);
    updateForm('composers', newComposers);
  };
  
  const updateComposer = (id: string, field: string, value: any) => {
    const newComposers = formState.composers.map(c => 
      c.id === id ? { ...c, [field]: field === 'share' ? Number(value) : value } : c
    );
    updateForm('composers', newComposers);
  };
  
  // Add/remove handlers for producers
  const addProducer = () => {
    const newProducers = [
      ...formState.producers,
      { id: Date.now().toString(), name: "", role: "Producer" }
    ];
    updateForm('producers', newProducers);
  };
  
  const removeProducer = (id: string) => {
    const newProducers = formState.producers.filter(p => p.id !== id);
    updateForm('producers', newProducers);
  };
  
  const updateProducer = (id: string, field: string, value: any) => {
    const newProducers = formState.producers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateForm('producers', newProducers);
  };
  
  // Add/remove handlers for engineers
  const addEngineer = () => {
    const newEngineers = [
      ...formState.engineers,
      { id: Date.now().toString(), name: "", role: "Engineer" }
    ];
    updateForm('engineers', newEngineers);
  };
  
  const removeEngineer = (id: string) => {
    const newEngineers = formState.engineers.filter(e => e.id !== id);
    updateForm('engineers', newEngineers);
  };
  
  const updateEngineer = (id: string, field: string, value: any) => {
    const newEngineers = formState.engineers.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    );
    updateForm('engineers', newEngineers);
  };
  
  // Add/remove handlers for performers
  const addPerformer = () => {
    const newPerformers = [
      ...formState.performers,
      { id: Date.now().toString(), name: "", instrument: "" }
    ];
    updateForm('performers', newPerformers);
  };
  
  const removePerformer = (id: string) => {
    const newPerformers = formState.performers.filter(p => p.id !== id);
    updateForm('performers', newPerformers);
  };
  
  const updatePerformer = (id: string, field: string, value: any) => {
    const newPerformers = formState.performers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateForm('performers', newPerformers);
  };
  
  // AI suggestions for credits
  const getAiSuggestions = () => {
    // Check if missing specific roles
    let hasEngineer = formState.engineers.some(e => e.role === "Mixing Engineer");
    let hasMastering = formState.engineers.some(e => e.role === "Mastering Engineer");
    
    // Add common roles if missing
    const updatedEngineers = [...formState.engineers];
    
    if (!hasEngineer) {
      updatedEngineers.push({ 
        id: Date.now().toString(), 
        name: "Studio Professional", 
        role: "Mixing Engineer" 
      });
    }
    
    if (!hasMastering) {
      updatedEngineers.push({ 
        id: Date.now() + 1000 + "", 
        name: "Master Professional", 
        role: "Mastering Engineer" 
      });
    }
    
    if (updatedEngineers.length !== formState.engineers.length) {
      updateForm('engineers', updatedEngineers);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Composers Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">Composers / Songwriters</h3>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Individuals who wrote the music and/or lyrics. Shares should total 100%.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addComposer}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {formState.composers.map((composer, index) => (
                <div key={composer.id} className="flex flex-wrap md:flex-nowrap gap-2 items-end">
                  <div className="w-full md:w-2/5">
                    <Label htmlFor={`composer-name-${composer.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`composer-name-${composer.id}`}
                      value={composer.name}
                      onChange={(e) => updateComposer(composer.id, 'name', e.target.value)}
                      placeholder="Composer name"
                      className={!composer.name ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <Label htmlFor={`composer-role-${composer.id}`} className="text-xs">Role</Label>
                    <Input
                      id={`composer-role-${composer.id}`}
                      value={composer.role}
                      onChange={(e) => updateComposer(composer.id, 'role', e.target.value)}
                      placeholder="e.g., Songwriter, Composer"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <Label htmlFor={`composer-share-${composer.id}`} className="text-xs">Share %</Label>
                    <Input
                      id={`composer-share-${composer.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={composer.share}
                      onChange={(e) => updateComposer(composer.id, 'share', e.target.value)}
                      placeholder="% share"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeComposer(composer.id)}
                    className="flex-shrink-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formState.composers.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  No composers added yet. Click "Add" to add composers.
                </div>
              )}
              
              {/* Show total share info */}
              {formState.composers.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Total shares: {formState.composers.reduce((sum, c) => sum + (c.share || 0), 0)}% 
                  {formState.composers.reduce((sum, c) => sum + (c.share || 0), 0) !== 100 && 
                    " (should equal 100%)"}
                </div>
              )}
            </div>
          </div>
          
          {/* Producers Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">Producers</h3>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Individuals who produced the track, including executive producers, co-producers, etc.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addProducer}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {formState.producers.map((producer) => (
                <div key={producer.id} className="flex flex-wrap md:flex-nowrap gap-2 items-end">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`producer-name-${producer.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`producer-name-${producer.id}`}
                      value={producer.name}
                      onChange={(e) => updateProducer(producer.id, 'name', e.target.value)}
                      placeholder="Producer name"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`producer-role-${producer.id}`} className="text-xs">Role</Label>
                    <Input
                      id={`producer-role-${producer.id}`}
                      value={producer.role}
                      onChange={(e) => updateProducer(producer.id, 'role', e.target.value)}
                      placeholder="e.g., Producer, Executive Producer"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeProducer(producer.id)}
                    className="flex-shrink-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formState.producers.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  No producers added yet. Click "Add" to add producers.
                </div>
              )}
            </div>
          </div>
          
          {/* Engineers Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">Engineers</h3>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Technical professionals such as mixing engineers, mastering engineers, recording engineers, etc.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addEngineer}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {formState.engineers.map((engineer) => (
                <div key={engineer.id} className="flex flex-wrap md:flex-nowrap gap-2 items-end">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`engineer-name-${engineer.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`engineer-name-${engineer.id}`}
                      value={engineer.name}
                      onChange={(e) => updateEngineer(engineer.id, 'name', e.target.value)}
                      placeholder="Engineer name"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`engineer-role-${engineer.id}`} className="text-xs">Role</Label>
                    <Input
                      id={`engineer-role-${engineer.id}`}
                      value={engineer.role}
                      onChange={(e) => updateEngineer(engineer.id, 'role', e.target.value)}
                      placeholder="e.g., Mixing Engineer, Mastering Engineer"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeEngineer(engineer.id)}
                    className="flex-shrink-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formState.engineers.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  No engineers added yet. Click "Add" to add engineers.
                </div>
              )}
            </div>
          </div>
          
          {/* Performers Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">Performers</h3>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Musicians, singers, and other performers who contributed to the track.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addPerformer}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {formState.performers.map((performer) => (
                <div key={performer.id} className="flex flex-wrap md:flex-nowrap gap-2 items-end">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`performer-name-${performer.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`performer-name-${performer.id}`}
                      value={performer.name}
                      onChange={(e) => updatePerformer(performer.id, 'name', e.target.value)}
                      placeholder="Performer name"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor={`performer-instrument-${performer.id}`} className="text-xs">Instrument/Role</Label>
                    <Input
                      id={`performer-instrument-${performer.id}`}
                      value={performer.instrument}
                      onChange={(e) => updatePerformer(performer.id, 'instrument', e.target.value)}
                      placeholder="e.g., Vocals, Guitar, Bass"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removePerformer(performer.id)}
                    className="flex-shrink-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formState.performers.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  No performers added yet. Click "Add" to add performers.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={getAiSuggestions}
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Suggestions</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
