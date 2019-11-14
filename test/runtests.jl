using DiskDataProviders, Test, Serialization

ontravis() = haskey(ENV, "TRAVIS_BRANCH")

@time @testset "DiskDataProviders" begin
    @info "Testing DiskDataProviders"
    dirpath = mktempdir()*"/"
    N = 100
    T = 500
    bs = 2
    labs = rand(1:5, N)
    files = dirpath .* string.(1:N) .* ".bin"

    @testset "Vector data" begin
        @info "Testing Vector data"

        for i = 1:N
            a = randn(T)
            serialize(dirpath*"$(i).bin", (a, labs[i]))
        end

        TYPE = ChannelDiskDataProvider{Vector{Float64}, Int}
        TYPE = QueueDiskDataProvider{Vector{Float64}, Int}
        for TYPE in [ChannelDiskDataProvider{Vector{Float64}, Int}, QueueDiskDataProvider{Vector{Float64}, Int}]

            @info "Testing $TYPE" @__LINE__()
            dataset = TYPE((T,), bs, 5; labels=labs, files=files)
            datasett, datasetv = DiskDataProviders.stratifiedobs(dataset, 0.75)

            @test intersect(datasett.files, datasetv.files) == []
            @test Set(union(datasett.files, datasetv.files)) == Set(dataset.files)

            @test sort(dataset.ulabels) == 1:5

            cdata = collect(dataset)
            @test length(cdata) == N
            @test cdata == collect(unbuffered(dataset))

            @test_throws ErrorException first(batchview(dataset))
            @test length.(first(dataset)) == (T,1)

            @show t = start_reading(dataset)
            @show @__LINE__()
            sleep(1)
            @show t
            TYPE <: QueueDiskDataProvider && @show dataset.queue_full.set
            wait(dataset)
            @info "Dataset ready"
            bw = batchview(dataset)
            @test length(collect(bw)) == N ÷ bs
            @test ontravis() || size.(first(bw)) == ((T,bs), (bs,))

            @test DiskDataProviders.queuelength(dataset) == 5
            @test size.(DiskDataProviders.full_batch(dataset)) == ((T,N),(N,))
            stop!(dataset)

            cub = collect(unbuffered_batchview(dataset))
            @test length(cub) == N ÷ bs
            @test size.(cub[1]) == ((T,bs),(2,))


            dataset = nothing
            GC.gc();GC.gc();GC.gc();GC.gc();
            @info "Done with $TYPE"
        end

    end


    @testset "Matrix data" begin
        @info "Testing Matrix data"
        width = 4
        for i = 1:N
            a = randn(T,width)
            serialize(dirpath*"$(i).bin", (a, labs[i]))
        end

        TYPE = QueueDiskDataProvider{Matrix{Float64}, Int}
        for TYPE in [ChannelDiskDataProvider{Matrix{Float64}, Int}, QueueDiskDataProvider{Matrix{Float64}, Int}]

            @info "Testing $TYPE" @__LINE__()
            dataset = TYPE((T,width,1), bs, 5; labels=labs, files=files)
            datasett, datasetv = stratifiedobs(dataset, 0.75)

            @test intersect(datasett.files, datasetv.files) == []
            @test Set(union(datasett.files, datasetv.files)) == Set(dataset.files)

            @test sort(dataset.ulabels) == 1:5

            cdata = collect(dataset)
            @test length(cdata) == N

            @test_throws ErrorException first(batchview(dataset))
            @test length.(first(dataset)) == (T*width,1)

            @show t = start_reading(dataset)
            @show @__LINE__()
            sleep(1)
            @show t
            TYPE <: QueueDiskDataProvider && @show dataset.queue_full.set
            wait(dataset)
            @info "Dataset ready"
            bw = batchview(dataset)
            @test length(collect(bw)) == N ÷ bs
            @test ontravis() || size.(first(bw)) == ((T,width,1,bs), (bs,))

            @test DiskDataProviders.queuelength(dataset) == 5
            @test size.(DiskDataProviders.full_batch(dataset)) == ((T,width,1,N),(N,))
            stop!(dataset)

            cub = collect(unbuffered_batchview(dataset))
            @test length(cub) == N ÷ bs
            @test size.(cub[1]) == ((T,width,1,bs),(2,))

            dataset = nothing
            GC.gc();GC.gc();GC.gc();GC.gc();
            @info "Done with $TYPE"
        end
    end


    @testset "nothing labels" begin
        @info "Testing Vector data"

        for i = 1:N
            a = randn(T)
            serialize(dirpath*"$(i).bin", (a, nothing))
        end

        TYPE = QueueDiskDataProvider{Vector{Float64}, Nothing}
        for TYPE in [ChannelDiskDataProvider{Vector{Float64}, Nothing}, QueueDiskDataProvider{Vector{Float64}, Nothing}]

            @info "Testing $TYPE" @__LINE__()
            dataset = TYPE((T,), bs, 5; files=files)
            datasett, datasetv = stratifiedobs(dataset, 0.75)

            cdata = collect(dataset)
            @test length(cdata) == N

            @test_throws ErrorException first(batchview(dataset))
            @test length(first(dataset)[1]) == T

            @show t = start_reading(dataset)
            @show @__LINE__()
            sleep(1)
            @show t
            TYPE <: QueueDiskDataProvider && @show dataset.queue_full.set
            wait(dataset)
            @info "Dataset ready"
            bw = batchview(dataset)
            @test length(collect(bw)) == N ÷ bs
            @test ontravis() || size.(first(bw)) == ((T,bs),(0,))

            @test DiskDataProviders.queuelength(dataset) == 5
            @test size(DiskDataProviders.full_batch(dataset)) == (T,N)

            stop!(dataset)

            cub = collect(unbuffered_batchview(dataset))
            @test length(cub) == N ÷ bs
            @test size(cub[1]) == (T,bs)


            dataset = nothing
            GC.gc();GC.gc();GC.gc();GC.gc();
            @info "Done with $TYPE"
        end
    end


end

println("Done")
