function TeamManagement({ project }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">팀 관리</h3>
      <div className="space-y-4">
        {project.team.map((member, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md border border-white/20">
            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-medium">
              {member[0]}
            </div>
            <div>
              <div className="font-medium">{member}</div>
              <div className="text-sm text-gray-600">팀 멤버</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamManagement
