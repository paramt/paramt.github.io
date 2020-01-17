require "bundler"
require "colorize"

abort("Please use `bundle exec rake`!") unless ENV["BUNDLE_BIN_PATH"]

repos = [
    "projects", "timeline", "videocloud", "MemeAdviser", 
    "assignments", "kevlar", "email-status", "discord-emoji"
]

task default: %w[build]
task :build do
    repos.each do |r|
        puts "\nSetting up #{r}...".blue
        sh "rm -rf #{r}"
        sh "git clone https://github.com/paramt/#{r}.git --quiet"
        has_readme = false
        Pathname(r).each_child(false) do |f|
            if f == "README.md"
                has_readme = true
            end
        end
        unless not has_readme
            sh "cd #{r} && cp README.md index.md && cd .."
        end
    end
    puts "\nDone!".green
end
