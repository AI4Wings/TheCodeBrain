import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from '../components/ui/navigation-menu'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Navigation() {
  const navigate = useNavigate()

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className="text-lg font-semibold"
                onClick={() => navigate('/')}
              >
                CodeBrain
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button 
          variant="outline" 
          onClick={() => navigate('/playbooks/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Playbook
        </Button>
      </div>
    </div>
  )
}
