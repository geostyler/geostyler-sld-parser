<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>
      Styled Label
    </se:Name>
    <UserStyle>
      <se:Name>
        Styled Label
      </se:Name>
      <se:Title>
        Styled Label
      </se:Title>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:TextSymbolizer>
            <se:Label>
              <ogc:Literal>
                <![CDATA[prefix: ]]>
              </ogc:Literal>
              <ogc:PropertyName>
                name
              </ogc:PropertyName>
              <ogc:PropertyName>
                title
              </ogc:PropertyName>
              <ogc:Literal>
                <![CDATA[ entity]]>
              </ogc:Literal>
            </se:Label>
            <se:Font>
              <se:SvgParameter name="font-family">
                Arial
              </se:SvgParameter>
              <se:SvgParameter name="font-size">
                12
              </se:SvgParameter>
              <se:SvgParameter name="font-style">
                normal
              </se:SvgParameter>
              <se:SvgParameter name="font-weight">
                bold
              </se:SvgParameter>
            </se:Font>
            <se:LabelPlacement>
              <se:PointPlacement>
                <se:Displacement>
                  <se:DisplacementX>
                    0
                  </se:DisplacementX>
                  <se:DisplacementY>
                    5
                  </se:DisplacementY>
                </se:Displacement>
                <se:Rotation>
                  45
                </se:Rotation>
              </se:PointPlacement>
            </se:LabelPlacement>
            <se:Halo>
              <se:Radius>
                5
              </se:Radius>
              <se:Fill>
                <se:SvgParameter name="fill">
                  #000000
                </se:SvgParameter>
              </se:Fill>
            </se:Halo>
            <se:Fill>
              <se:SvgParameter name="fill">
                #000000
              </se:SvgParameter>
              <se:SvgParameter name="fill-opacity">
                1
              </se:SvgParameter>
            </se:Fill>
          </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
