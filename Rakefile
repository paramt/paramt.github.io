require 'bundler'
require 'html-proofer'

abort('Please run tests using `bundle exec rake --trace --verbose`') unless ENV["BUNDLE_BIN_PATH"]

task default: %w[test]

task :test do
  options = {
    :check_opengraph => true,
    :check_favicon => true,
    :check_html => true,
    :check_external_hash => true,
    :enforce_https => true,
    :check_img_http => true,
    :log_level => :debug,
    :parallel => {
      :in_processes => 2
    },
    :typhoeus => {
      :verbose => true,
      :followlocation => true,
      :connecttimeout => 10,
      :timeout => 30
    },
    :hydra => {
      :max_concurrency => 5
    }
  }
  puts "## RUNNING BUILD SCRIPT ##"
  sh "bundler exec jekyll build"
  puts "## RUNNING TESTS ##"
  sh "bundler exec jekyll doctor"
  begin
    HTMLProofer.check_directories(["_site"], options)
  rescue => msg
    puts "#{msg}"
  end
  puts "## ALL TASKS HAVE FINISHED ##"
end
